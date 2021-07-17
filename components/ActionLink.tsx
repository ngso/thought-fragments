interface Props {
  color: string;
  onClick: () => void;
}

const ActionLink: React.FC<Props> = ({ color, onClick, children }) => {
  return (
    <span
      onClick={onClick}
      className={`hover:text-${color}-600 cursor-pointer text-sm`}
    >
      {children}
    </span>
  );
};

export default ActionLink;
