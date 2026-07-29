type AddTaskFieldProps = { text: string };

export const AddTaskField = ({ text }: AddTaskFieldProps) => {
  return (
    <>
      <label htmlFor="task" style={{ color: 'gray' }}>
        {text}
      </label>
      <input id="task" />
    </>
  );
};
