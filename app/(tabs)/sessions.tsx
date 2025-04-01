import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useSession } from "../../context/SessionContext";

const Sessions = () => {
  const { sessions } = useSession();

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  const renderSession = ({ item }) => (
    <View style={styles.sessionItem}>
      <Text style={styles.sessionText}>Duration: {formatTime(item.duration)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sessions</Text>
      <FlatList
        data={Object.keys(sessionsByDate)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>{date}</Text>
            <FlatList
              data={sessionsByDate[date]}
              keyExtractor={(session) => session.id.toString()}
              renderItem={renderSession}
            />
          </View>
        )}
      />
    </View>
  );
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sessionItem: {
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    marginBottom: 5,
  },
  sessionText: {
    fontSize: 16,
  },
});

export default Sessions;


