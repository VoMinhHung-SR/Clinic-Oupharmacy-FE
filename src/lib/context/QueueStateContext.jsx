import { createContext, useCallback, useEffect, useRef, useState } from "react";
// import { fetchListExaminationToday } from "../../modules/pages/WaittingRoomComponents/services";

export const QueueStateContext = createContext({});

export const QueueStateProvider = ({ children }) => {
  // const [initialState, setInitialState] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState(null);

  const [queue, setQueue] = useState([]);
  const initialQueueRef = useRef(queue);

  const enqueue = (item) => {
    setQueue([...queue, item]);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      return undefined;
    }

    const item = queue[0];
    setQueue(queue.slice(1));
    return item;
  };

  useEffect(() => {
    const loadListExamToday = async () => {
      // const res = await fetchListExaminationToday();
      try {
        if (res.status === 200) {
          setQueue(res.data);
        }
      } catch (err) {
        const res = err.response;
        if (res.status === 500) {
          setQueue([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadListExamToday();
  }, []);

  useEffect(() => {
    if (JSON.stringify(queue) !== JSON.stringify(initialQueueRef.current)) {
      initialQueueRef.current = queue;
    }
  }, [queue]);

  return (
    <QueueStateContext.Provider
      value={{
        front: queue[0],
        getLength: () => queue.length,
        isEmpty: () => queue.length === 0,
        dequeue,
        enqueue,
        items: queue,
      }}
    >
      {children}
    </QueueStateContext.Provider>
  );
};
