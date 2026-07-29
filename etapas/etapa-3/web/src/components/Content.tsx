const Content = () => {
  return (
    <div className="body">
      <label htmlFor="task" style={{ color: 'gray' }}>
        Nova tarefa:
      </label>
      <input id="task" />
    </div>
  );
};

export default Content;
