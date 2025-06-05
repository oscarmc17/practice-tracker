import React, { useMemo, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSession } from "../../context/SessionContext";

const Sessions = () => {
    const { sessions } = useSession();
    const [selectedDate, setSelectedDate] = useState(null);

    // Group sessions by date
    const sessionsByDate = useMemo(() => {
        return sessions.reduce((acc, session) => {
            const date = new Date(session.timestamp)
                .toISOString()
                .split("T")[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(session);
            return acc;
        }, {});
    }, [sessions]);

    // Create marking data for the calendar
    const markedDates = useMemo(() => {
        const markings = {};
        Object.keys(sessionsByDate).forEach((date) => {
            const sessionCount = sessionsByDate[date].length;
            markings[date] = {
                marked: true,
                dots: Array(Math.min(sessionCount, 2)).fill({
                    color: "#32CD32",
                }), // Up to 2 dots
            };
        });
        return markings;
    }, [sessionsByDate]);

    const renderSession = ({ item }) => (
        <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>
                Duration: {formatTime(item.duration)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sessions</Text>
            <Calendar
                markingType="multi-dot"
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                    selectedDayBackgroundColor: "#32CD32",
                    todayTextColor: "#32CD32",
                    arrowColor: "#32CD32",
                }}
                onDayPress={(day) => {
                    const date = day.dateString;
                    if (sessionsByDate[date]) {
                        setSelectedDate(date);
                    } else {
                        setSelectedDate(null);
                    }
                }}
            />
            {selectedDate && sessionsByDate[selectedDate] && (
                <View style={styles.dateSection}>
                    <Text style={styles.dateText}>{selectedDate}</Text>
                    <FlatList
                        data={sessionsByDate[selectedDate]}
                        keyExtractor={(session) => session.id.toString()}
                        renderItem={renderSession}
                    />
                </View>
            )}
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
    calendar: {
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
