import React, { createContext, useContext, useState } from "react";

// Create the context
const EventContext = createContext();

// Custom hook to use the EventContext
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};

// Provider component
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const value = {
    events,
    setEvents,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
