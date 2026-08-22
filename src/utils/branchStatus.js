/**
 * UrbanBite Restaurant Branch Status Utility
 * Checks whether a branch is open based on live flags and operating hours.
 */

export const isBranchOpen = (branch) => {
  if (!branch) return false;
  if (branch.active === false || branch.isOpen === false) return false;

  const timing =
    branch.timing ||
    (branch.openingTime && branch.closingTime
      ? `${branch.openingTime} - ${branch.closingTime}`
      : '');
  if (!timing) return true;

  try {
    const parts = timing.split(' - ');
    if (parts.length < 2) return true;
    const [openStr, closeStr] = parts.map((s) => s.trim());

    const toMinutes = (str) => {
      const match = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return null;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const openMinutes = toMinutes(openStr);
    const closeMinutes = toMinutes(closeStr);

    if (openMinutes === null || closeMinutes === null) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Overnight operating hours (e.g. 4:00 PM to 02:00 AM)
    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } catch {
    return true;
  }
};

export const getBranchStatusInfo = (branch) => {
  const timing =
    branch?.timing ||
    (branch?.openingTime && branch?.closingTime
      ? `${branch.openingTime} - ${branch.closingTime}`
      : '11:00 AM - 02:00 AM');
  const open = isBranchOpen(branch);
  const openTime = timing.split(' - ')[0] || '11:00 AM';

  return {
    isOpen: open,
    timing,
    openTime,
    statusBadgeText: open ? '● Open Now' : '● Closed',
    closedNotice: `Branch is currently closed. Online orders will resume at ${openTime}.`
  };
};
