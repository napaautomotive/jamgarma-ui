export const fmtMoney = (n: number) =>
  new Intl.NumberFormat('uz-UZ').format(n) + " so'm";

export const fmtDuration = (s: number) => {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleString('uz-UZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return d; }
};

export const initials = (name: string) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
