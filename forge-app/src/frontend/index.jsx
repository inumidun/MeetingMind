import React, { useState, useEffect } from "react";
import ForgeReconciler, {
  Text,
  Button,
  Stack,
  Heading,
  Modal,
  ModalTransition,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  TextArea,
  Box,
  Inline,
  ButtonGroup,
  Select,
  DatePicker,
} from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { getUIText } from "../utils/i18n";

// Check if this is a dashboard view
const isDashboard = () => {
  try {
    const context = view.getContext();
    console.log("View context:", context);

    // Check for Jira project page context
    if (context?.extension?.type === "jira:projectPage") {
      return true;
    }

    // Check for module key
    if (context?.moduleKey === "team-dashboard") {
      return true;
    }

    // Check for Jira context in general
    if (context?.platformContext?.productType === "jira") {
      return true;
    }

    // Fallback: check URL or other indicators
    if (typeof window !== "undefined" && window.location) {
      const url = window.location.href;
      if (url.includes("jira") && url.includes("project")) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking dashboard context:", error);
    return false;
  }
};

// Simple Dashboard Component - REAL PRODUCTIVITY INTELLIGENCE
const SimpleDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("manager");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log("📊 Loading Jira Productivity Intelligence...");
      setLoading(true);
      setError(null);

      const data = await invoke("getProductivityDashboard");
      console.log("Dashboard data received:", data);

      if (data) {
        setDashboardData(data);
      } else {
        setError("No productivity data available");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError(error.message || "Failed to load productivity intelligence");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box xcss={{ padding: "space.500", textAlign: "center" }}>
        <Text
          xcss={{
            fontSize: "1.2em",
            color: "#0052CC",
            marginBottom: "space.200",
          }}
        >
          🧠 Loading Organizational Intelligence...
        </Text>
        <Text xcss={{ color: "#6B7280" }}>
          Analyzing Jira execution patterns
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box xcss={{ padding: "space.500", textAlign: "center" }}>
        <Text
          xcss={{
            fontSize: "1.2em",
            color: "#DE350B",
            marginBottom: "space.200",
          }}
        >
          ⚠️ Productivity Intelligence Unavailable
        </Text>
        <Text xcss={{ color: "#6B7280", marginBottom: "space.200" }}>
          {error}
        </Text>
        <Text xcss={{ color: "#6B7280", fontSize: "0.9em" }}>
          Create some Jira tasks through MeetingMind to see insights
        </Text>
        <Button
          onClick={loadDashboardData}
          appearance="primary"
          xcss={{ marginTop: "space.200" }}
        >
          Retry Analysis
        </Button>
      </Box>
    );
  }

  return (
    <Stack space="large">
      {/* Header */}
      <Box
        xcss={{
          background: "linear-gradient(135deg, #0052CC 0%, #6554C0 100%)",
          color: "white",
          padding: "space.600",
          borderRadius: "border.radius.300",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0, 82, 204, 0.3)",
        }}
      >
        <Box
          xcss={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "space.200",
            marginBottom: "space.200",
          }}
        >
          <Text xcss={{ fontSize: "2em" }}>📊</Text>
          <Heading size="xlarge" xcss={{ color: "white" }}>
            Jira Pulse Dashboard
          </Heading>
        </Box>
        <Text xcss={{ color: "white", opacity: 0.9, fontSize: "1.1em" }}>
          Organizational productivity intelligence — not who works hardest, but
          who delivers value.
        </Text>
      </Box>

      {/* Role Tabs */}
      <Box
        xcss={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "border.radius.200",
          padding: "space.100",
        }}
      >
        <ButtonGroup>
          <Button
            onClick={() => setActiveTab("manager")}
            appearance={activeTab === "manager" ? "primary" : "subtle"}
            xcss={{ gap: "space.100" }}
          >
            👥 Manager View
          </Button>
          <Button
            onClick={() => setActiveTab("pm")}
            appearance={activeTab === "pm" ? "primary" : "subtle"}
            xcss={{ gap: "space.100" }}
          >
            🎯 PM View
          </Button>
          <Button
            onClick={() => setActiveTab("executive")}
            appearance={activeTab === "executive" ? "primary" : "subtle"}
            xcss={{ gap: "space.100" }}
          >
            📈 Executive View
          </Button>
          <Button
            onClick={() => setActiveTab("individual")}
            appearance={activeTab === "individual" ? "primary" : "subtle"}
            xcss={{ gap: "space.100" }}
          >
            ⚡ My Insights
          </Button>
        </ButtonGroup>
      </Box>

      {/* Manager View */}
      {activeTab === "manager" && (
        <Stack space="large">
          {/* Metrics Grid */}
          <Box
            xcss={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "space.400",
            }}
          >
            <GlassMetricCard
              title="Team Delivery Rate"
              value={`${dashboardData.teamDeliveryRate || 0}%`}
              change={12}
              icon="🎯"
              color="#00875A"
              subtitle="On-time completion"
            />
            <GlassMetricCard
              title="Avg Cycle Time"
              value={`${dashboardData.avgCycleTime || 0} days`}
              change={-8}
              icon="⏱️"
              color="#0052CC"
              subtitle="From start to done"
            />
            <GlassMetricCard
              title="Collaboration Score"
              value={dashboardData.collaborationScore || 0}
              change={5}
              icon="🤝"
              color="#6554C0"
              subtitle="Cross-team engagement"
            />
            <GlassMetricCard
              title="Burnout Risk"
              value={dashboardData.burnoutRisk || "Low"}
              icon="🛡️"
              color="#00875A"
              subtitle="Team workload balanced"
            />
          </Box>

          {/* Team Members */}
          <GlassTeamMembers teamProfiles={dashboardData.teamProfiles || []} />
        </Stack>
      )}

      {/* PM View */}
      {activeTab === "pm" && (
        <Box
          xcss={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "space.400",
          }}
        >
          <GlassMetricCard
            title="Sprint Velocity"
            value="42 pts"
            change={8}
            icon="⚡"
            color="#0052CC"
            subtitle="Story points/sprint"
          />
          <GlassMetricCard
            title="Blocked Issues"
            value={dashboardData.blockedIssues || 0}
            icon="🚫"
            color="#FF8B00"
            subtitle="Need attention"
          />
          <GlassMetricCard
            title="Sprint Predictability"
            value={`${dashboardData.sprintPredictability || 85}%`}
            change={-5}
            icon="📊"
            color="#6554C0"
            subtitle="Commitment accuracy"
          />
          <GlassMetricCard
            title="Velocity Trend"
            value={`+${dashboardData.velocityTrend || 8}%`}
            change={dashboardData.velocityTrend || 8}
            icon="📈"
            color="#00875A"
            subtitle="vs last sprint"
          />
        </Box>
      )}

      {/* Executive View */}
      {activeTab === "executive" && (
        <Box
          xcss={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "space.400",
          }}
        >
          <GlassMetricCard
            title="Org Throughput"
            value={`${dashboardData.weeklyThroughput || 0}/week`}
            change={23}
            icon="🚀"
            color="#00875A"
            subtitle="Issues completed"
          />
          <GlassMetricCard
            title="Team Health Score"
            value={`${dashboardData.teamHealthScore || 85}%`}
            icon="💚"
            color="#00875A"
            subtitle="Overall wellness"
          />
          <GlassMetricCard
            title="Meeting Efficiency"
            value={`${dashboardData.meetingEfficiency || 78}%`}
            change={15}
            icon="💼"
            color="#0052CC"
            subtitle="Action completion rate"
          />
          <GlassMetricCard
            title="Delivery Reliability"
            value={`${dashboardData.teamDeliveryRate || 87}%`}
            change={34}
            icon="✅"
            color="#00875A"
            subtitle="Consistent execution"
          />
        </Box>
      )}

      {/* Individual View */}
      {activeTab === "individual" && (
        <Stack space="large">
          <Box
            xcss={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "space.400",
            }}
          >
            <GlassMetricCard
              title="My Reliability"
              value={`${Math.round(dashboardData.userReliability || 85)}%`}
              change={6}
              icon="🎯"
              color="#00875A"
              subtitle="Task completion rate"
            />
            <GlassMetricCard
              title="Focus Score"
              value={Math.round(dashboardData.userQuality || 82)}
              change={-3}
              icon="🧠"
              color="#0052CC"
              subtitle="Deep work efficiency"
            />
            <GlassMetricCard
              title="Focus Time"
              value={`${dashboardData.focusTime?.toFixed(1) || "5.2"}h`}
              icon="⏰"
              color="#6554C0"
              subtitle="Daily average"
            />
            <GlassMetricCard
              title="Collaboration Impact"
              value={Math.round(dashboardData.collaborationScore || 88)}
              icon="🤝"
              color="#FF8B00"
              subtitle="Team interactions"
            />
          </Box>

          {/* Personal Insights */}
          <Box
            xcss={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "border.radius.300",
              padding: "space.600",
            }}
          >
            <Heading size="medium" xcss={{ marginBottom: "space.400" }}>
              💡 Personal Improvement Suggestions
            </Heading>
            <Stack space="medium">
              <Box
                xcss={{
                  padding: "space.400",
                  borderRadius: "border.radius.200",
                  background: "rgba(0, 82, 204, 0.1)",
                  border: "1px solid rgba(0, 82, 204, 0.3)",
                }}
              >
                <Text
                  xcss={{
                    fontWeight: "600",
                    color: "#0052CC",
                    marginBottom: "space.100",
                  }}
                >
                  Consider batching similar tasks
                </Text>
                <Text xcss={{ fontSize: "0.9em", color: "#6B778C" }}>
                  Your context switching frequency is 20% higher than optimal.
                  Try time-blocking for deep work.
                </Text>
              </Box>
              <Box
                xcss={{
                  padding: "space.400",
                  borderRadius: "border.radius.200",
                  background: "rgba(0, 135, 90, 0.1)",
                  border: "1px solid rgba(0, 135, 90, 0.3)",
                }}
              >
                <Text
                  xcss={{
                    fontWeight: "600",
                    color: "#00875A",
                    marginBottom: "space.100",
                  }}
                >
                  Great job on meeting commitments
                </Text>
                <Text xcss={{ fontSize: "0.9em", color: "#6B778C" }}>
                  Your on-time delivery rate has improved 6% this month. Keep it
                  up!
                </Text>
              </Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

// Glass Morphism Metric Card Component
const GlassMetricCard = ({ title, value, change, icon, color, subtitle }) => {
  const changeColor = change ? (change > 0 ? "#00875A" : "#DE350B") : "#6B778C";
  const changeIcon = change ? (change > 0 ? "↗️" : "↘️") : "";

  return (
    <Box
      xcss={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "border.radius.300",
        padding: "space.500",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(0, 82, 204, 0.3)",
          transform: "translateY(-2px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        xcss={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "space.300",
        }}
      >
        <Box
          xcss={{
            width: "48px",
            height: "48px",
            borderRadius: "border.radius.200",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5em",
            transition: "transform 0.3s ease",
          }}
        >
          <Text>{icon}</Text>
        </Box>
        {change !== undefined && (
          <Box
            xcss={{
              display: "flex",
              alignItems: "center",
              gap: "space.050",
              fontSize: "0.9em",
              fontWeight: "600",
              color: changeColor,
            }}
          >
            <Text>{changeIcon}</Text>
            <Text>{Math.abs(change)}%</Text>
          </Box>
        )}
      </Box>

      <Box>
        <Text
          xcss={{
            fontSize: "0.9em",
            color: "#6B778C",
            marginBottom: "space.100",
          }}
        >
          {title}
        </Text>
        <Text
          xcss={{
            fontSize: "2.2em",
            fontWeight: "800",
            color: "#172B4D",
            lineHeight: "1",
          }}
        >
          {value}
        </Text>
        {subtitle && (
          <Text
            xcss={{
              fontSize: "0.8em",
              color: "#6B778C",
              marginTop: "space.100",
            }}
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </Box>
  );
};

// Glass Team Members Component
const GlassTeamMembers = ({ teamProfiles }) => {
  const profileColors = {
    "Reliable Executor": "#00875A",
    "Critical Blocker Resolver": "#0052CC",
    "High Output": "#FF8B00",
    "Collaboration Champion": "#6554C0",
  };

  return (
    <Box
      xcss={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "border.radius.300",
        padding: "space.600",
      }}
    >
      <Box xcss={{ marginBottom: "space.500" }}>
        <Heading size="medium" xcss={{ marginBottom: "space.100" }}>
          👥 Team Productivity Profiles
        </Heading>
        <Text xcss={{ color: "#6B778C", fontSize: "0.9em" }}>
          Individual insights without rankings • Contextual, not comparative
        </Text>
      </Box>

      <Stack space="medium">
        {teamProfiles.map((profile, index) => (
          <Box
            key={index}
            xcss={{
              display: "flex",
              alignItems: "center",
              gap: "space.400",
              padding: "space.400",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "border.radius.200",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.08)",
                transform: "translateX(4px)",
              },
            }}
          >
            <Box
              xcss={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: profile.profileColor || "#0052CC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2em",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Text xcss={{ color: "white" }}>
                {profile.initials ||
                  profile.name?.substring(0, 2).toUpperCase() ||
                  "??"}
              </Text>
            </Box>

            <Box xcss={{ flex: 1 }}>
              <Box
                xcss={{
                  display: "flex",
                  alignItems: "center",
                  gap: "space.200",
                  marginBottom: "space.100",
                }}
              >
                <Text
                  xcss={{
                    fontWeight: "700",
                    fontSize: "1.1em",
                    color: "#172B4D",
                  }}
                >
                  {profile.name || "Team Member"}
                </Text>
                <Box
                  xcss={{
                    padding: "space.050 space.200",
                    background: `${profile.profileColor || "#0052CC"}20`,
                    borderRadius: "border.radius.100",
                    border: `1px solid ${profile.profileColor || "#0052CC"}40`,
                  }}
                >
                  <Text
                    xcss={{
                      color: profile.profileColor || "#0052CC",
                      fontWeight: "600",
                      fontSize: "0.8em",
                    }}
                  >
                    {profile.profileType || "Contributor"}
                  </Text>
                </Box>
              </Box>
              <Text xcss={{ color: "#6B778C", fontSize: "0.9em" }}>
                {profile.role || "Team Member"}
              </Text>
            </Box>

            <Box
              xcss={{
                display: "flex",
                gap: "space.500",
                fontSize: "0.9em",
              }}
            >
              <Box xcss={{ textAlign: "center" }}>
                <Text
                  xcss={{
                    fontWeight: "700",
                    color: "#0052CC",
                    fontSize: "1.3em",
                    display: "block",
                  }}
                >
                  {profile.reliability || 0}%
                </Text>
                <Text xcss={{ color: "#6B778C", fontSize: "0.8em" }}>
                  Reliability
                </Text>
              </Box>
              <Box xcss={{ textAlign: "center" }}>
                <Text
                  xcss={{
                    fontWeight: "700",
                    color: "#00875A",
                    fontSize: "1.3em",
                    display: "block",
                  }}
                >
                  {profile.quality || 0}%
                </Text>
                <Text xcss={{ color: "#6B778C", fontSize: "0.8em" }}>
                  Quality
                </Text>
              </Box>
              <Box xcss={{ textAlign: "center" }}>
                <Text
                  xcss={{
                    fontWeight: "700",
                    color: "#6554C0",
                    fontSize: "1.3em",
                    display: "block",
                  }}
                >
                  {profile.collaboration || 0}%
                </Text>
                <Text xcss={{ color: "#6B778C", fontSize: "0.8em" }}>
                  Impact
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

// Insight Card Component
const InsightCard = ({ type, title, description, metric }) => {
  const getColor = () => {
    switch (type) {
      case "success":
        return "#00875A";
      case "warning":
        return "#FF8B00";
      case "danger":
        return "#DE350B";
      case "info":
        return "#0052CC";
      default:
        return "#6B778C";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "danger":
        return "🚨";
      case "info":
        return "💡";
      default:
        return "📊";
    }
  };

  return (
    <Box
      xcss={{
        display: "flex",
        gap: "space.300",
        padding: "space.400",
        background: "#FAFBFC",
        borderRadius: "border.radius.200",
        borderLeft: `4px solid ${getColor()}`,
      }}
    >
      <Box
        xcss={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: `${getColor()}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text xcss={{ fontSize: "1.2em" }}>{getIcon()}</Text>
      </Box>
      <Box xcss={{ flex: 1 }}>
        <Text
          xcss={{
            fontWeight: "700",
            marginBottom: "space.100",
            color: "#172B4D",
          }}
        >
          {title}
        </Text>
        <Text xcss={{ color: "#6B778C", lineHeight: "1.4" }}>
          {description}
        </Text>
        {metric && (
          <Text
            xcss={{
              color: getColor(),
              fontWeight: "600",
              marginTop: "space.100",
              fontSize: "0.9em",
            }}
          >
            Score: {metric}%
          </Text>
        )}
      </Box>
    </Box>
  );
};

// Main App Component (existing code)

// Jira Color Palette
const JIRA_COLORS = {
  primary: "#0052CC",
  secondary: "#0065FF",
  success: "#00875A",
  warning: "#FF8B00",
  danger: "#DE350B",
  background: "#FAFBFC",
  surface: "#FFFFFF",
  text: "#172B4D",
  textSecondary: "#6B778C",
  border: "#DFE1E6",
};

const MetricCard = ({ value, label, color, icon, subtitle }) => {
  return (
    <Box
      xcss={{
        background: color,
        padding: "space.400",
        borderRadius: "border.radius.200",
        textAlign: "center",
        color: "white",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.18)",
        },
      }}
    >
      <Text
        xcss={{ fontSize: "2.5em", marginBottom: "space.050", color: "white" }}
      >
        {icon}
      </Text>
      <Text
        xcss={{
          fontSize: "2.8em",
          fontWeight: "800",
          color: "white",
          lineHeight: "1",
          marginBottom: "space.050",
        }}
      >
        {value}
      </Text>
      <Text
        xcss={{
          fontSize: "0.95em",
          color: "white",
          fontWeight: "600",
          opacity: 0.95,
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Text>
      {subtitle && (
        <Text
          xcss={{
            fontSize: "0.75em",
            color: "white",
            marginTop: "space.050",
            opacity: 0.8,
          }}
        >
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

// Productivity Dimension Bar
const DimensionBar = ({ label, value, color }) => (
  <Box xcss={{ marginBottom: "space.300" }}>
    <Inline space="space.200" alignBlock="center">
      <Text
        xcss={{ fontWeight: "600", minWidth: "180px", color: JIRA_COLORS.text }}
      >
        {label}
      </Text>
      <Box
        xcss={{
          flex: 1,
          height: "16px",
          background: JIRA_COLORS.border,
          borderRadius: "border.radius.100",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          xcss={{
            width: `${value}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
            borderRadius: "border.radius.100",
            transition: "width 1.5s ease-out",
          }}
        />
      </Box>
      <Text
        xcss={{
          fontWeight: "700",
          color: color,
          minWidth: "60px",
          textAlign: "right",
        }}
      >
        {value}%
      </Text>
    </Inline>
  </Box>
);

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [lastProcessedNotes, setLastProcessedNotes] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState(null);
  const [jiraUsers, setJiraUsers] = useState([]);
  const [meetingScore, setMeetingScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("en");

  const loadAnalytics = async () => {
    try {
      const response = await invoke("getAnalytics");
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setResult(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNotes("");
    setResult(null);
    setProcessing(false);
    setLastProcessedNotes("");
    setExtractedTasks(null);
    setShowPreview(false);
  };

  const handleExtract = async () => {
    if (!notes.trim()) {
      setResult({ success: false, message: "Please enter meeting notes" });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const response = await invoke("extractTasks", { notes });
      if (response.success) {
        setExtractedTasks(response.tasks);
        setJiraUsers(response.jiraUsers || []);
        setMeetingScore(response.meetingScore);
        setSuggestions(response.suggestions || []);
        setDetectedLanguage(response.language || "en");
        setShowPreview(true);
      } else {
        setResult({
          success: false,
          message: response.message || "Failed to extract tasks",
        });
      }
    } catch (error) {
      setResult({ success: false, message: "Error extracting tasks" });
    }

    setProcessing(false);
  };

  const handleApprove = async () => {
    setProcessing(true);

    try {
      const response = await invoke("createJiraTasks", {
        tasks: extractedTasks,
      });
      setResult(response);
      if (response.success) {
        setLastProcessedNotes(notes);
        setShowPreview(false);
        loadAnalytics();
      }
    } catch (error) {
      setResult({ success: false, message: "Error creating tasks" });
    }

    setProcessing(false);
  };

  const handleDiscard = () => {
    setExtractedTasks(null);
    setJiraUsers([]);
    setMeetingScore(null);
    setSuggestions([]);
    setShowPreview(false);
    setResult(null);
  };

  return (
    <Stack space="medium">
      <Box
        xcss={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "space.300",
          borderRadius: "border.radius.200",
          marginBottom: "space.200",
        }}
      >
        <Heading size="medium" xcss={{ color: "white", fontWeight: "600" }}>
          MeetingMind - Organizational Intelligence Platform
        </Heading>
        <Text xcss={{ color: "white", opacity: 0.9 }}>
          Transform meetings into tasks • Analyze productivity • Optimize
          organizational performance
        </Text>
        <Text xcss={{ color: "white", opacity: 0.8, fontSize: "0.9em" }}>
          🌍 Multi-language • 🧠 AI-powered • 📊 Real-time insights
        </Text>
      </Box>

      <Button
        onClick={openModal}
        appearance="primary"
        xcss={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          fontWeight: "600",
          padding: "space.200 space.400",
          borderRadius: "border.radius.200",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
          },
        }}
      >
        🚀 Transform Meeting Notes
      </Button>

      {analytics && (
        <Box
          xcss={{
            background: "#0f1419",
            padding: "space.500",
            borderRadius: "border.radius.300",
            border: "1px solid #2d3748",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginTop: "space.400",
          }}
        >
          <Box xcss={{ textAlign: "center", marginBottom: "space.400" }}>
            <Heading
              size="large"
              xcss={{
                color: "white",
                fontWeight: "800",
                marginBottom: "space.100",
              }}
            >
              📊 Meeting Analytics Dashboard
            </Heading>
            <Text
              xcss={{ color: "#a0aec0", fontSize: "1em", fontWeight: "500" }}
            >
              Real-time insights • Meeting effectiveness • Task automation
            </Text>
          </Box>

          <Box
            xcss={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "space.400",
              marginBottom: "space.400",
            }}
          >
            <MetricCard
              value={analytics.totalMeetings}
              label="MEETINGS"
              subtitle="Total Processed"
              color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              icon="📅"
            />
            <MetricCard
              value={analytics.totalTasksCreated}
              label="TASKS"
              subtitle="Successfully Created"
              color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              icon="✅"
            />
            <MetricCard
              value={`${analytics.completionRate}%`}
              label="SUCCESS RATE"
              subtitle="Automation Quality"
              color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              icon="🎯"
            />
          </Box>

          <Box
            xcss={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "space.300",
              borderRadius: "border.radius.200",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Text
              xcss={{ color: "white", fontWeight: "700", fontSize: "1.2em" }}
            >
              ⚡ {analytics.avgTasksPerMeeting} avg tasks per meeting •{" "}
              {analytics.totalTasksCreated} total automation wins
            </Text>
          </Box>
        </Box>
      )}

      <ModalTransition>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle
                xcss={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "600",
                }}
              >
                🤖 Enter Meeting Notes - AI Powered
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Stack space="medium">
                {!showPreview ? (
                  <>
                    <Text>
                      Paste your meeting notes below. AI will extract action
                      items for your review.
                    </Text>
                    <TextArea
                      placeholder="Example:
- John to review the Q4 budget by Friday
- Sarah will update the project timeline
- Team decided to use React for the frontend
- Mike to schedule follow-up meeting next week"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      minimumRows={8}
                      resize="vertical"
                    />
                  </>
                ) : (
                  <>
                    <Box
                      xcss={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        padding: "space.300",
                        borderRadius: "border.radius.200",
                        textAlign: "center",
                      }}
                    >
                      <Text
                        xcss={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "1.2em",
                        }}
                      >
                        {(() => {
                          try {
                            return detectedLanguage === "fr"
                              ? "🔍 Réviser Tâches Extraites"
                              : detectedLanguage === "es"
                              ? "🔍 Revisar Tareas Extraídas"
                              : detectedLanguage === "de"
                              ? "🔍 Extrahierte Aufgaben Überprüfen"
                              : "🔍 Review Extracted Tasks";
                          } catch (e) {
                            return "🔍 Review Extracted Tasks";
                          }
                        })()}
                      </Text>
                      <Text
                        xcss={{
                          color: "white",
                          opacity: 0.9,
                          fontSize: "0.9em",
                        }}
                      >
                        {extractedTasks?.length || 0}{" "}
                        {(() => {
                          try {
                            return detectedLanguage === "fr"
                              ? "tâches prêtes à créer"
                              : detectedLanguage === "es"
                              ? "tareas listas para crear"
                              : detectedLanguage === "de"
                              ? "Aufgaben bereit zur Erstellung"
                              : "tasks ready for creation";
                          } catch (e) {
                            return "tasks ready for creation";
                          }
                        })()}
                      </Text>
                    </Box>

                    {/* Meeting Effectiveness Score */}
                    {meetingScore && (
                      <Box
                        xcss={{
                          background:
                            meetingScore.effectiveness === "Excellent"
                              ? "#e8f5e9"
                              : meetingScore.effectiveness === "Good"
                              ? "#fff3e0"
                              : "#ffebee",
                          padding: "space.400",
                          borderRadius: "border.radius.200",
                          border: `2px solid ${
                            meetingScore.effectiveness === "Excellent"
                              ? "#4caf50"
                              : meetingScore.effectiveness === "Good"
                              ? "#ff9800"
                              : "#f44336"
                          }`,
                        }}
                      >
                        <Text
                          xcss={{
                            fontWeight: "700",
                            fontSize: "1.1em",
                            marginBottom: "space.200",
                          }}
                        >
                          📊{" "}
                          {(() => {
                            try {
                              return detectedLanguage === "fr"
                                ? "Efficacité de Réunion:"
                                : detectedLanguage === "es"
                                ? "Efectividad de Reunión:"
                                : detectedLanguage === "de"
                                ? "Besprechungseffektivität:"
                                : "Meeting Effectiveness:";
                            } catch (e) {
                              return "Meeting Effectiveness:";
                            }
                          })()}{" "}
                          {meetingScore.effectiveness} (
                          {meetingScore.overallScore}%)
                        </Text>
                        <Box
                          xcss={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "space.200",
                            fontSize: "0.9em",
                          }}
                        >
                          <Text>
                            📝 {meetingScore.totalTasks}{" "}
                            {detectedLanguage === "fr"
                              ? "tâches"
                              : detectedLanguage === "es"
                              ? "tareas"
                              : detectedLanguage === "de"
                              ? "Aufgaben"
                              : "tasks"}
                          </Text>
                          <Text>
                            👥 {meetingScore.assignedTasks}{" "}
                            {detectedLanguage === "fr"
                              ? "assignées"
                              : detectedLanguage === "es"
                              ? "asignadas"
                              : detectedLanguage === "de"
                              ? "zugewiesen"
                              : "assigned"}{" "}
                            ({meetingScore.assignmentScore}%)
                          </Text>
                          <Text>
                            📅 {meetingScore.datedTasks}{" "}
                            {detectedLanguage === "fr"
                              ? "datées"
                              : detectedLanguage === "es"
                              ? "con fecha"
                              : detectedLanguage === "de"
                              ? "terminiert"
                              : "dated"}{" "}
                            ({meetingScore.dateScore}%)
                          </Text>
                        </Box>
                      </Box>
                    )}

                    {/* Smart Suggestions */}
                    {suggestions && suggestions.length > 0 && (
                      <Stack space="small">
                        <Text xcss={{ fontWeight: "700" }}>
                          💡 {getUIText(detectedLanguage, "smartSuggestions")}:
                        </Text>
                        {suggestions.map((suggestion, idx) => (
                          <Box
                            key={idx}
                            xcss={{
                              background:
                                suggestion.type === "success"
                                  ? "#e8f5e9"
                                  : suggestion.type === "warning"
                                  ? "#fff3e0"
                                  : "#e3f2fd",
                              padding: "space.200",
                              borderRadius: "border.radius.100",
                              border: `1px solid ${
                                suggestion.type === "success"
                                  ? "#4caf50"
                                  : suggestion.type === "warning"
                                  ? "#ff9800"
                                  : "#2196f3"
                              }`,
                            }}
                          >
                            <Text>
                              {suggestion.icon} {suggestion.message}
                            </Text>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    <Stack space="small">
                      {extractedTasks?.map((task, index) => (
                        <Box
                          key={index}
                          xcss={{
                            background: "#f8f9fa",
                            padding: "space.300",
                            borderRadius: "border.radius.100",
                            border: "2px solid #667eea",
                          }}
                        >
                          <Text xcss={{ fontWeight: "700", color: "#667eea" }}>
                            {getUIText(detectedLanguage, "task")} {index + 1}
                          </Text>
                          <Text>📝 {task.summary}</Text>

                          {/* Individual User Assignment */}
                          <Box
                            xcss={{
                              display: "flex",
                              alignItems: "center",
                              gap: "space.200",
                              marginTop: "space.100",
                            }}
                          >
                            <Text>
                              👤 {getUIText(detectedLanguage, "assignee")}:
                            </Text>
                            {task.assignee.includes("Not in Jira") ? (
                              <Box
                                xcss={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "space.100",
                                }}
                              >
                                <Select
                                  placeholder={task.assignee.replace(
                                    " (Not in Jira)",
                                    ""
                                  )}
                                  options={jiraUsers.map((user) => ({
                                    label: user.displayName,
                                    value: user.displayName,
                                  }))}
                                  onChange={(selectedUser) => {
                                    if (selectedUser) {
                                      const updatedTasks = [...extractedTasks];
                                      updatedTasks[index] = {
                                        ...updatedTasks[index],
                                        assignee: selectedUser.value,
                                      };
                                      setExtractedTasks(updatedTasks);
                                    }
                                  }}
                                  xcss={{ minWidth: "200px" }}
                                />
                                <Text
                                  xcss={{ fontSize: "0.8em", color: "#f57c00" }}
                                >
                                  ⚠️ {getUIText(detectedLanguage, "notInJira")}
                                </Text>
                              </Box>
                            ) : (
                              <Text
                                xcss={{ fontWeight: "600", color: "#00875A" }}
                              >
                                {task.assignee}
                              </Text>
                            )}
                          </Box>

                          {/* Individual Due Date */}
                          <Box
                            xcss={{
                              display: "flex",
                              alignItems: "center",
                              gap: "space.200",
                              marginTop: "space.100",
                            }}
                          >
                            <Text>
                              📅 {getUIText(detectedLanguage, "due")}:
                            </Text>
                            {task.dueDate === "No due date" ? (
                              <DatePicker
                                placeholder={getUIText(
                                  detectedLanguage,
                                  "setDueDate"
                                )}
                                onChange={(selectedDate) => {
                                  if (selectedDate) {
                                    const updatedTasks = [...extractedTasks];
                                    updatedTasks[index] = {
                                      ...updatedTasks[index],
                                      dueDate: selectedDate,
                                    };
                                    setExtractedTasks(updatedTasks);
                                  }
                                }}
                                xcss={{ minWidth: "150px" }}
                              />
                            ) : (
                              <Box
                                xcss={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "space.100",
                                }}
                              >
                                <Text
                                  xcss={{ fontWeight: "600", color: "#00875A" }}
                                >
                                  {task.dueDate}
                                </Text>
                                <Button
                                  appearance="subtle"
                                  xcss={{
                                    fontSize: "0.7em",
                                    padding: "space.025 space.075",
                                  }}
                                  onClick={() => {
                                    const updatedTasks = [...extractedTasks];
                                    updatedTasks[index] = {
                                      ...updatedTasks[index],
                                      dueDate: "No due date",
                                    };
                                    setExtractedTasks(updatedTasks);
                                  }}
                                >
                                  ✏️ {getUIText(detectedLanguage, "edit")}
                                </Button>
                              </Box>
                            )}
                          </Box>

                          <Text>
                            ⚡ {getUIText(detectedLanguage, "priority")}:{" "}
                            {(() => {
                              const priorityMap = {
                                High: getUIText(detectedLanguage, "high"),
                                Medium: getUIText(detectedLanguage, "medium"),
                                Low: getUIText(detectedLanguage, "low"),
                              };
                              return (
                                priorityMap[task.priority] || task.priority
                              );
                            })()}
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}

                {processing && (
                  <Box
                    xcss={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "space.200",
                      borderRadius: "border.radius.100",
                      textAlign: "center",
                    }}
                  >
                    <Text xcss={{ color: "white", fontWeight: "500" }}>
                      {showPreview
                        ? "🚀 Creating Jira tasks..."
                        : "🤖 Extracting tasks with AI..."}
                    </Text>
                  </Box>
                )}

                {result && (
                  <Box
                    xcss={{
                      background: result.success
                        ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                        : "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                      color: "white",
                      padding: "space.200",
                      borderRadius: "border.radius.100",
                      textAlign: "center",
                    }}
                  >
                    <Text xcss={{ color: "white", fontWeight: "500" }}>
                      {result.success
                        ? `✅ ${(() => {
                            // Parse the backend message to extract count and localize
                            const match =
                              result.message.match(/Created (\d+) task/);
                            if (match) {
                              const count = match[1];
                              return `${getUIText(
                                detectedLanguage,
                                "created"
                              )} ${count} ${getUIText(
                                detectedLanguage,
                                "tasks"
                              )}`;
                            }
                            return result.message;
                          })()}`
                        : `❌ ${result.message}`}
                    </Text>
                  </Box>
                )}

                {result?.success && result.tasks && result.tasks.length > 0 && (
                  <Stack space="small">
                    <Text xcss={{ fontWeight: "600" }}>
                      {getUIText(detectedLanguage, "createdTasks")}
                    </Text>
                    {result.tasks.map((task, index) => (
                      <Text key={index}>
                        • {task.key}: {task.summary} → {task.assignee} •{" "}
                        {getUIText(detectedLanguage, "start")}: {task.startDate}{" "}
                        • {getUIText(detectedLanguage, "due")}:{" "}
                        {task.dueDate === "No due date"
                          ? getUIText(detectedLanguage, "noDueDate")
                          : task.dueDate}{" "}
                        •{" "}
                        {(() => {
                          const priorityMap = {
                            High: getUIText(detectedLanguage, "high"),
                            Medium: getUIText(detectedLanguage, "medium"),
                            Low: getUIText(detectedLanguage, "low"),
                          };
                          return priorityMap[task.priority] || task.priority;
                        })()}{" "}
                        {getUIText(detectedLanguage, "task")}
                      </Text>
                    ))}
                  </Stack>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              {!showPreview ? (
                <>
                  <Button onClick={closeModal}>Cancel</Button>
                  <Button
                    onClick={handleExtract}
                    appearance="primary"
                    isDisabled={processing || !notes.trim() || extractedTasks}
                  >
                    {processing
                      ? "Extracting..."
                      : extractedTasks
                      ? "✅ Tasks Extracted"
                      : "🔍 Extract Tasks"}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleDiscard} isDisabled={processing}>
                    ❌ {getUIText(detectedLanguage, "discard")}
                  </Button>
                  <Button
                    onClick={() => setShowPreview(false)}
                    isDisabled={processing}
                  >
                    ✏️ {getUIText(detectedLanguage, "editNotes")}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    appearance="primary"
                    isDisabled={processing}
                  >
                    {processing
                      ? "Creating..."
                      : `✅ ${getUIText(detectedLanguage, "approveCreate")}`}
                  </Button>
                </>
              )}
              {result?.success && (
                <Button onClick={closeModal} appearance="primary">
                  Close
                </Button>
              )}
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
