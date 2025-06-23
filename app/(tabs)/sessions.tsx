import React, { useMemo, useState } from "react";
import { Text, View, StyleSheet, FlatList, ListRenderItem } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSession } from "../../context/SessionContext";

interface Session {
    id: number;
    duration: number;
    timestamp: string;
}

type SessionsByDate = Record<string, Session[]>;

function getLocalDateString(isoString: string) {
    // Always get the local date (YYYY-MM-DD) from ISO string with offset
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const Sessions = () => {
    const { sessions } = useSession();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Group sessions by local date
    const sessionsByDate: SessionsByDate = useMemo(() => {
        return sessions.reduce<SessionsByDate>((acc, session) => {
            const date = getLocalDateString(session.timestamp);
            if (!acc[date]) acc[date] = [];
            acc[date].push(session);
            return acc;
        }, {});
    }, [sessions]);

    // Create marking data for the calendar
    const markedDates = useMemo(() => {
        const markings: Record<string, any> = {};
        Object.keys(sessionsByDate).forEach((date) => {
            const sessionCount = sessionsByDate[date].length;
            markings[date] = {
                marked: true,
                dots: Array(Math.min(sessionCount, 2)).fill({
                    color: "#32CD32",
                }), // Up to 2 dots
            };
        });
        // Highlight selected date with a lighter, semi-transparent green
        if (selectedDate) {
            markings[selectedDate] = {
                ...(markings[selectedDate] || {}),
                selected: true,
                selectedColor: "rgba(50, 205, 50, 0.50)", // lighter, transparent green
            };
        }
        return markings;
    }, [sessionsByDate, selectedDate]);

    const renderSession: ListRenderItem<Session> = ({ item }) => (
        <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>
                Duration: {formatTime(item.duration)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recent Sessions</Text>
            <Calendar
                markingType="multi-dot"
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                    selectedDayBackgroundColor: "#32CD32",
                    todayTextColor: "#32CD32",
                    arrowColor: "#32CD32",
                }}
                onDayPress={(day: { dateString: string }) => {
                    setSelectedDate(day.dateString);
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

const formatTime = (seconds: number): string => {
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
