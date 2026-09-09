import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from './ui';
import { useAuth } from '../auth/AuthProvider';
import { useReviews } from '../reviews/ReviewsProvider';
import { StoredReview } from '../reviews/db';
import { Place } from '../data/types';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing } from '../theme/tokens';

const REPORT_REASONS = ['Conteúdo ofensivo', 'Spam ou propaganda', 'Informação falsa', 'Outro'];

function formatDate(ts: number, fallback?: string) {
  if (!ts && fallback) return fallback;
  return new Date(ts).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

export function ReviewsSection({ place }: { place: Place }) {
  const router = useRouter();
  const { user } = useAuth();
  const { actorId, myReviewFor, reviewsFor, hasReported, upsert, remove, report } = useReviews();
  const mine = myReviewFor(place.id);
  const others = reviewsFor(place.id).filter((r) => r.userId !== actorId);
  const seeds = (place.reviews ?? []).map((r, i) => ({
    id: `seed:${place.id}:${i}`,
    placeId: place.id,
    userId: 'seed',
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    createdAt: 0,
    updatedAt: 0,
    dateLabel: r.date,
  }));

  const list = [...others, ...seeds];
  const extra = mine ? 1 : 0;
  const shownCount = place.reviewsCount + extra;

  const [editing, setEditing] = React.useState(!mine);
  const [stars, setStars] = React.useState(mine?.rating ?? 0);
  const [comment, setComment] = React.useState(mine?.comment ?? '');
  const [reportTarget, setReportTarget] = React.useState<string | null>(null);

  React.useEffect(() => {
    setStars(mine?.rating ?? 0);
    setComment(mine?.comment ?? '');
    setEditing(!mine);
  }, [mine, place.id]);

  const save = async () => {
    if (stars < 1) {
      Alert.alert('Nota', 'Escolha de 1 a 5 estrelas.');
      return;
    }
    if (comment.trim().length < 3) {
      Alert.alert('Comentário', 'Escreva pelo menos algumas palavras.');
      return;
    }
    await upsert(place.id, stars, comment);
    setEditing(false);
  };

  const confirmDelete = () => {
    if (!mine) return;
    Alert.alert('Excluir avaliação', 'Essa nota some deste aparelho. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void remove(mine.id);
        },
      },
    ]);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Avaliações ({shownCount.toLocaleString('pt-BR')})</Text>

      {!user && (
        <Pressable style={styles.accountCard} onPress={() => router.push('/perfil')}>
          <Ionicons name="person-circle-outline" size={22} color={colors.tealDeep} />
          <View style={{ flex: 1 }}>
            <Text style={styles.accountTitle}>Vincular à conta</Text>
            <Text style={styles.accountText}>
              Sem login, a avaliação fica neste celular. Toque para cadastrar ou entrar — ela passa para a conta.
            </Text>
          </View>
        </Pressable>
      )}

      <View style={styles.composer}>
        <Text style={styles.composerLabel}>{mine && !editing ? 'Sua avaliação' : mine ? 'Editar avaliação' : 'Deixe sua avaliação'}</Text>
        <StarPicker value={editing ? stars : mine?.rating ?? 0} onChange={editing ? setStars : undefined} />
        {editing ? (
          <>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Como foi a experiência?"
              placeholderTextColor={colors.textFaint}
              multiline
              style={styles.input}
            />
            <View style={styles.composerActions}>
              {mine && (
                <Pressable onPress={() => setEditing(false)} style={styles.ghostBtn}>
                  <Text style={styles.ghostBtnText}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable onPress={() => void save()} style={styles.primaryBtn}>
                <Text style={styles.saveBtnText}>{mine ? 'Salvar' : 'Publicar'}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          mine && (
            <>
              <Text style={styles.reviewText}>{mine.comment}</Text>
              <Text style={styles.reviewDate}>{formatDate(mine.updatedAt)}</Text>
              <View style={styles.composerActions}>
                <Pressable onPress={() => setEditing(true)} style={styles.ghostBtn}>
                  <Text style={styles.ghostBtnText}>Editar</Text>
                </Pressable>
                <Pressable onPress={confirmDelete} style={styles.dangerBtn}>
                  <Text style={styles.dangerBtnText}>Excluir</Text>
                </Pressable>
              </View>
            </>
          )
        )}
      </View>

      {list.length === 0 && !mine ? (
        <Text style={styles.empty}>Seja o primeiro a avaliar este local.</Text>
      ) : (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {list.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              reported={hasReported(r.id)}
              onReport={() => setReportTarget(r.id)}
            />
          ))}
        </View>
      )}

      <ReportSheet
        visible={reportTarget != null}
        onClose={() => setReportTarget(null)}
        onSubmit={(reason) => {
          if (reportTarget) void report(reportTarget, place.id, reason);
          setReportTarget(null);
        }}
      />
    </View>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange?.(n)} disabled={!onChange} hitSlop={4}>
          <Ionicons name={n <= value ? 'star' : 'star-outline'} size={28} color={colors.star} />
        </Pressable>
      ))}
    </View>
  );
}

function ReviewCard({
  review,
  reported,
  onReport,
}: {
  review: StoredReview & { dateLabel?: string };
  reported: boolean;
  onReport: () => void;
}) {
  return (
    <View style={styles.review}>
      <View style={styles.reviewHead}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.author.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <Text style={styles.reviewDate}>{formatDate(review.createdAt, review.dateLabel)}</Text>
        </View>
        <Rating value={review.rating} size={fontSize.xs} />
      </View>
      <Text style={styles.reviewText}>{review.comment}</Text>
      <Pressable onPress={reported ? undefined : onReport} style={styles.reportBtn} disabled={reported}>
        <Ionicons name="flag-outline" size={13} color={reported ? colors.textFaint : colors.textMuted} />
        <Text style={[styles.reportText, reported && { color: colors.textFaint }]}>
          {reported ? 'Denúncia enviada' : 'Denunciar'}
        </Text>
      </Pressable>
    </View>
  );
}

function ReportSheet({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState(REPORT_REASONS[0]);
  React.useEffect(() => {
    if (visible) setReason(REPORT_REASONS[0]);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.sheetTitle}>Denunciar avaliação</Text>
          <Text style={styles.sheetHint}>A denúncia fica registrada e segue para moderação quando houver conta.</Text>
          <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
            {REPORT_REASONS.map((r) => {
              const on = reason === r;
              return (
                <Pressable key={r} onPress={() => setReason(r)} style={[styles.reason, on && styles.reasonOn]}>
                  <Text style={[styles.reasonText, on && styles.reasonTextOn]}>{r}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.saveBtn} onPress={() => onSubmit(reason)}>
            <Text style={styles.saveBtnText}>Enviar denúncia</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy, letterSpacing: -0.3, marginBottom: spacing.md },
  accountCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  accountTitle: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  accountText: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2, lineHeight: 16 },
  composer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  composerLabel: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  stars: { flexDirection: 'row', gap: 4, marginVertical: 4 },
  input: {
    minHeight: 88,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  composerActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  saveBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
  ghostBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.textMuted },
  dangerBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.danger },
  empty: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.md },
  review: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.heading, fontSize: fontSize.md, color: '#fff' },
  reviewAuthor: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  reviewDate: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textFaint },
  reviewText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  reportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md, alignSelf: 'flex-start' },
  reportText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textMuted },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.borderStrong, marginBottom: spacing.lg },
  sheetTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy },
  sheetHint: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  reason: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  reasonOn: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  reasonText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.text },
  reasonTextOn: { color: colors.tealDeep, fontFamily: fonts.bodySemi },
});
