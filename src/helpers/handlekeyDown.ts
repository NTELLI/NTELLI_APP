export type EventType = React.KeyboardEvent<HTMLFormElement>;

export const handleKeyDown = (event: EventType, { handleSubmit }: any) => {
	if (event.key === "Enter" && !event.shiftKey) {
		event.preventDefault();
		handleSubmit(event);
	}
};
