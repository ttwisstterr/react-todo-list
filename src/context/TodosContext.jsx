import { createContext, useReducer } from "react";

const storage = localStorage.getItem("todo-item");
const initTodo = storage ? JSON.parse(storage) : [];

function todosReducer(todos, action) {
  switch (action.type) {
    case "onAdded":
      return [
        {
          id: generateId(),
          text: action.text,
          done: false,
        },
        ...todos,
      ];
    case "onUpdated":
      return todos.map((t) => (t.id === action.todo.id ? action.todo : t));
    case "onDeleted":
      return todos.filter((t) => t.id !== action.id);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function updateStorage(todos) {
  localStorage.setItem("todo-item", JSON.stringify(todos));
}

function generateId() {
  return Math.floor(Math.random() * 1000) + 10;
}

export const TodosContext = createContext(null);
export const TodosDispatchContext = createContext(null);

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer((state, action) => {
    const updatedTodos = todosReducer(state, action);
    updateStorage(updatedTodos);
    return updatedTodos;
  }, initTodo);

  return (
    <TodosContext.Provider value={todos}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  );
}
