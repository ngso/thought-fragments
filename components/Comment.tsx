interface Props {
  username: string;
  body: string;
}

const Comment: React.FC<Props> = ({ username, body }) => {
  return (
    <article className="bg-white w-11/12 max-w-3xl mb-4 p-8 rounded-md">
      <h3 className="font-bold">{username}</h3>
      <p>{body}</p>
    </article>
  );
};

export default Comment;
