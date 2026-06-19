import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./AuditLogsPage.scss";
import {
  FaSearch,
  FaHistory,
  FaUser,
  FaShieldAlt,
  FaCalendarAlt,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaDatabase,
  FaInfoCircle,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "System Audit Trails",
    searchPlaceholder: "Search logs by action, target, actor, or description...",
    filterAll: "All Activities",
    filterSecurity: "Security Logs",
    filterWrites: "Write Events",
    actor: "Actor",
    action: "Action Type",
    target: "Target Resource",
    description: "Activity Description",
    date: "Audit Timestamp",
    loading: "Loading system logs...",
    empty: "No activity records found.",
    actionLogin: "Login Auth",
    actionCreate: "Create Record",
    actionUpdate: "Update Record",
    actionDelete: "Delete Record",
    actionOther: "System Event",
  },
  kh: {
    title: "សកម្មភាពប្រព័ន្ធ",
    searchPlaceholder: "ស្វែងរកកំណត់ហេតុតាមសកម្មភាព ធនធាន អ្នកធ្វើ ឬការពិពណ៌នា...",
    filterAll: "សកម្មភាពទាំងអស់",
    filterSecurity: "កំណត់ហេតុសន្តិសុខ",
    filterWrites: "ព្រឹត្តិការណ៍សរសេរ",
    actor: "អ្នកប្រតិបត្តិ",
    action: "ប្រភេទសកម្មភាព",
    target: "ធនធានគោលដៅ",
    description: "ការពិពណ៌នាសកម្មភាព",
    date: "ពេលវេលាកត់ត្រា",
    loading: "កំពុងទាញយកកំណត់ហេតុប្រព័ន្ធ...",
    empty: "រកមិនឃើញប្រវត្តិកំណត់ហេតុសកម្មភាពឡើយ។",
    actionLogin: "ចូលគណនី",
    actionCreate: "បង្កើតទិន្នន័យ",
    actionUpdate: "កែប្រែទិន្នន័យ",
    actionDelete: "លុបទិន្នន័យ",
    actionOther: "ព្រឹត្តិការណ៍ប្រព័ន្ធ",
  },
  zh: {
    title: "系统审计日志",
    searchPlaceholder: "按操作、目标、执行者或描述搜索日志...",
    filterAll: "所有活动",
    filterSecurity: "安全日志",
    filterWrites: "写操作事件",
    actor: "执行者",
    action: "操作类型",
    target: "目标资源",
    description: "活动描述",
    date: "审计时间戳",
    loading: "正在加载系统日志...",
    empty: "未找到任何活动记录。",
    actionLogin: "登录认证",
    actionCreate: "创建记录",
    actionUpdate: "更新记录",
    actionDelete: "删除记录",
    actionOther: "系统事件",
  }
};

const TimelineSkeleton = () => (
  <div className="skeleton-timeline">
    {[1, 2, 3, 4].map((n) => (
      <div className="skeleton-timeline-item" key={n}>
        <div className="skeleton-circle skeleton-shimmer"></div>
        <div className="skeleton-content-wrapper">
          <div className="skeleton-line title skeleton-shimmer"></div>
          <div className="skeleton-line text skeleton-shimmer"></div>
          <div className="skeleton-line footer skeleton-shimmer"></div>
        </div>
      </div>
    ))}
  </div>
);

const AuditLogsPage = () => {
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, security, writes

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(language === "kh" ? "km-KH" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/logs");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setLogs(data);
        }
      } catch (err) {
        setError("Failed to fetch system logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentUser]);

  const getActionIcon = (action) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("LOGOUT") || act.includes("AUTH")) {
      return <FaShieldAlt className="icon security" />;
    }
    if (act.includes("CREATE")) {
      return <FaPlus className="icon create" />;
    }
    if (act.includes("UPDATE") || act.includes("TOGGLE")) {
      return <FaPen className="icon update" />;
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return <FaTrashAlt className="icon delete" />;
    }
    return <FaDatabase className="icon other" />;
  };

  const getActionLabel = (action) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("LOGOUT")) {
      return getTranslation("actionLogin");
    }
    if (act.includes("CREATE")) {
      return getTranslation("actionCreate");
    }
    if (act.includes("UPDATE") || act.includes("TOGGLE")) {
      return getTranslation("actionUpdate");
    }
    if (act.includes("DELETE")) {
      return getTranslation("actionDelete");
    }
    return getTranslation("actionOther");
  };

  // Filters & Search logic
  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    
    // Safety check for empty refs
    const actorName = log.userId?.nameuser?.toLowerCase() || "system";
    const actorEmail = log.userId?.email?.toLowerCase() || "";
    const description = log.description?.toLowerCase() || "";
    const action = log.action?.toLowerCase() || "";
    const model = log.targetModel?.toLowerCase() || "";

    const matchesSearch =
      actorName.includes(query) ||
      actorEmail.includes(query) ||
      description.includes(query) ||
      action.includes(query) ||
      model.includes(query);

    let matchesTab = true;
    const act = log.action.toUpperCase();
    if (activeTab === "security") {
      matchesTab = act.includes("LOGIN") || act.includes("LOGOUT") || act.includes("AUTH");
    } else if (activeTab === "writes") {
      matchesTab =
        act.includes("CREATE") ||
        act.includes("UPDATE") ||
        act.includes("DELETE") ||
        act.includes("TOGGLE");
    }

    return matchesSearch && matchesTab;
  });

  return (
    <AdminAppLayout>
      <div className="audit-logs-page-contain">
        <Label label={getTranslation("title")} />

        {error && <div className="error-toast">{error}</div>}

        {/* Toolbar: Search & tabs */}
        <div className="logs-toolbar">
          <div className="search-bar-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={getTranslation("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button
              className={activeTab === "all" ? "tab active" : "tab"}
              onClick={() => setActiveTab("all")}
            >
              <FaHistory /> {getTranslation("filterAll")}
            </button>
            <button
              className={activeTab === "security" ? "tab active" : "tab"}
              onClick={() => setActiveTab("security")}
            >
              <FaShieldAlt /> {getTranslation("filterSecurity")}
            </button>
            <button
              className={activeTab === "writes" ? "tab active" : "tab"}
              onClick={() => setActiveTab("writes")}
            >
              <FaPen /> {getTranslation("filterWrites")}
            </button>
          </div>
        </div>

        {/* Timeline Log Feed */}
        <div className="audit-timeline-container">
          {loading ? (
            <TimelineSkeleton />
          ) : filteredLogs.length === 0 ? (
            <div className="empty-results-card">
              <p>{getTranslation("empty")}</p>
            </div>
          ) : (
            <div className="timeline-feed">
              {filteredLogs.map((log) => (
                <div className="timeline-item" key={log._id}>
                  {/* Left Circle Icon */}
                  <div className="timeline-marker">
                    <div className="icon-circle">{getActionIcon(log.action)}</div>
                    <div className="timeline-line"></div>
                  </div>

                  {/* Right Content Bubble */}
                  <div className="timeline-content">
                    <div className="content-header">
                      <div className="header-left">
                        <span className={`action-badge ${log.action.toLowerCase()}`}>
                          {getActionLabel(log.action)} ({log.action})
                        </span>
                        {log.targetModel && (
                          <span className="target-badge">
                            Target: <strong>{log.targetModel}</strong>
                          </span>
                        )}
                      </div>
                      <div className="header-right">
                        <span className="log-time">
                          <FaCalendarAlt /> {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="content-body">
                      <p className="log-description">{log.description}</p>
                      {log.details && (
                        <div className="log-details-block">
                          <pre>{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>

                    <div className="content-footer">
                      {log.userId ? (
                        <div className="actor-profile">
                          <img
                            src={log.userId.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt={log.userId.nameuser}
                            className="actor-avatar"
                          />
                          <div className="actor-info">
                            <span className="actor-name">{log.userId.nameuser}</span>
                            <span className="actor-email">{log.userId.email}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="actor-profile system">
                          <FaInfoCircle className="system-icon" />
                          <div className="actor-info">
                            <span className="actor-name">SYSTEM OPERATION</span>
                            <span className="actor-email">system@cheang.com</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default AuditLogsPage;
