export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{4})(\d{7})/, '$1-$2');
};
