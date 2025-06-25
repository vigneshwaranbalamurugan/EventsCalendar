export const FAIcon = ({ icon, className = "", size = "16" }) => {
  const iconMap = {
    'chevron-left': '‹',
    'chevron-right': '›',
    'plus': '+',
    'edit': '✎',
    'trash': '🗑',
    'times': '×',
    'calendar': '📅',
    'clock': '🕐',
    'search': '🔍',
    'star': '★',
    'bolt': '⚡',
    'target': '🎯',
    'users': '👥'
  };

  return (
    <span
      className={`inline-block ${className}`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
      {iconMap[icon] || icon}
    </span>
  );
};
