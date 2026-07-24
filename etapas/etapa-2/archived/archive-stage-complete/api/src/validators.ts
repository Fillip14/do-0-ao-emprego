export const hasValidTitle = (body: unknown): body is { title: string } => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'title' in body &&
    typeof body.title === 'string' &&
    body.title.trim() !== ''
  );
};
