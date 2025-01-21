import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import styles from "@/app/styles/DashboardStyles";

interface Buddy {
  buddyId: string;
  name: string;
  birthday: Date;
  nickname: string;
  customMessage: string;
}

export default function HomeScreen() {
  const { userInfo, session } = useAuth();
  const router = useRouter();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !userInfo) return;

    const fetchUpcomingBuddies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/users/${userInfo.email}/buddies`
        );
        const data = await response.json();

        const currentDate = new Date();
        const upcomingBuddies = data
          .map((buddy: Buddy) => ({
            ...buddy,
            birthday: new Date(buddy.birthday),
          }))
          .filter((buddy: Buddy) => {
            const nextBirthday = new Date(
              currentDate.getFullYear(),
              buddy.birthday.getMonth(),
              buddy.birthday.getDate()
            );

            if (nextBirthday < currentDate) {
              nextBirthday.setFullYear(currentDate.getFullYear() + 1);
            }

            const diffDays =
              (nextBirthday.getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24);

            return diffDays <= 30;
          })
          .sort((a: Buddy, b: Buddy) => {
            const nextA = new Date(
              currentDate.getFullYear(),
              a.birthday.getMonth(),
              a.birthday.getDate()
            );
            const nextB = new Date(
              currentDate.getFullYear(),
              b.birthday.getMonth(),
              b.birthday.getDate()
            );

            if (nextA < currentDate)
              nextA.setFullYear(currentDate.getFullYear() + 1);
            if (nextB < currentDate)
              nextB.setFullYear(currentDate.getFullYear() + 1);

            return nextA.getTime() - nextB.getTime();
          });

        setBuddies(upcomingBuddies);
      } catch (error) {
        console.error("Error fetching buddies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBuddies();
  }, [session, userInfo]);

  if (!session || !userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Session has expired. Please log in again.
        </Text>
        <TouchableOpacity
          style={[styles.btn, styles.btnLight]}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={[styles.btnText]}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Welcome, {userInfo?.name?.split(" ")[0]}!
      </Text>

      <TouchableOpacity
        style={[styles.btn, styles.btnLight]}
        onPress={() => router.push("/buddies")}
      >
        <IconSymbol size={20} name="book.fill" color="#151718" />
        <Text style={styles.btnText}>View Buddies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnDark]}
        onPress={() => router.push("/add-buddy")}
      >
        <IconSymbol size={20} name="plus.circle.fill" color="#fff" />
        <Text style={[styles.btnText, styles.btnTextLight]}>Add Buddy</Text>
      </TouchableOpacity>

      {loading && <Text>Loading upcoming birthdays...</Text>}

      {!loading && buddies.length > 0 && (
        <>
          <Text style={styles.upcomingText}>Upcoming Birthdays:</Text>
          <View style={styles.upcomingList}>
            {buddies.map((buddy) => {
              const currentYear = new Date().getFullYear();
              const age =
                currentYear -
                buddy.birthday.getFullYear() -
                (new Date(
                  currentYear,
                  buddy.birthday.getMonth(),
                  buddy.birthday.getDate()
                ) < new Date()
                  ? 1
                  : 0);

              // Custom formatter for birthday
              const formattedBirthday = buddy.birthday.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <TouchableOpacity
                  key={buddy.buddyId}
                  style={styles.upcomingItem}
                  onPress={() =>
                    router.push({
                      pathname: "/buddy-details",
                      params: { buddyId: buddy.buddyId },
                    })
                  }
                >
                  <Text style={styles.nameText}>{buddy.name}</Text>
                  <Text style={styles.ageText}>{formattedBirthday}</Text>
                  <Text style={styles.ageText}>Age: {age}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}
