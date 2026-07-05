// 会议/期刊数据（示例数据，日期基于往年周期推算 —— 投稿前请核对官网！）
// deadline / abstractDeadline 使用 ISO 8601 带时区偏移；AoE = UTC-12 写作 -12:00
// rank: CCF-A / CCF-B / CCF-C / Non-CCF（CCF 等级请以最新推荐目录为准）
const AOE = "T23:59:59-12:00";
const PT = "T23:59:59-08:00";

const CONFERENCES = [
  // ================= AI / ML =================
  { name: "NeurIPS 2026", fullName: "Conference on Neural Information Processing Systems", area: "AI/ML", rank: "CCF-A",
    abstractDeadline: "2026-05-11" + AOE, deadline: "2026-05-15" + AOE, confDate: "2026-12", place: "TBD", link: "https://neurips.cc" },
  { name: "ICLR 2027", fullName: "International Conference on Learning Representations", area: "AI/ML", rank: "CCF-A",
    abstractDeadline: "2026-09-18" + AOE, deadline: "2026-09-24" + AOE, confDate: "2027-04", place: "TBD", link: "https://iclr.cc" },
  { name: "ICML 2027", fullName: "International Conference on Machine Learning", area: "AI/ML", rank: "CCF-A",
    deadline: "2027-01-28" + AOE, confDate: "2027-07", place: "TBD", link: "https://icml.cc" },
  { name: "AAAI 2027", fullName: "AAAI Conference on Artificial Intelligence", area: "AI/ML", rank: "CCF-A",
    abstractDeadline: "2026-07-25" + AOE, deadline: "2026-08-01" + AOE, confDate: "2027-01", place: "TBD", link: "https://aaai.org" },
  { name: "IJCAI 2027", fullName: "International Joint Conference on Artificial Intelligence", area: "AI/ML", rank: "CCF-A",
    deadline: "2027-01-15" + AOE, confDate: "2027-08", place: "TBD", link: "https://ijcai.org" },
  { name: "AISTATS 2027", fullName: "International Conference on Artificial Intelligence and Statistics", area: "AI/ML", rank: "CCF-C",
    abstractDeadline: "2026-10-01" + AOE, deadline: "2026-10-08" + AOE, confDate: "2027-04", place: "TBD", link: "https://aistats.org" },
  { name: "COLT 2027", fullName: "Conference on Learning Theory", area: "AI/ML", rank: "CCF-B",
    deadline: "2027-02-10" + AOE, confDate: "2027-06", place: "TBD", link: "https://learningtheory.org" },
  { name: "UAI 2027", fullName: "Conference on Uncertainty in Artificial Intelligence", area: "AI/ML", rank: "CCF-B",
    deadline: "2027-02-20" + AOE, confDate: "2027-07", place: "TBD", link: "https://auai.org" },
  { name: "AAMAS 2027", fullName: "International Conference on Autonomous Agents and Multiagent Systems", area: "AI/ML", rank: "CCF-B",
    abstractDeadline: "2026-10-01" + AOE, deadline: "2026-10-08" + AOE, confDate: "2027-05", place: "TBD", link: "https://aamas-conference.org" },
  { name: "ECAI 2027", fullName: "European Conference on Artificial Intelligence", area: "AI/ML", rank: "CCF-B",
    deadline: "2027-01-20" + AOE, confDate: "2027-10", place: "TBD", link: "https://ecai2027.eu" },

  // ================= 机器人 Robotics =================
  { name: "IROS 2027", fullName: "IEEE/RSJ International Conference on Intelligent Robots and Systems", area: "Robotics", rank: "CCF-C",
    deadline: "2027-03-01" + AOE, confDate: "2027-10", place: "TBD", link: "https://www.iros.org" },
  { name: "ICRA 2027", fullName: "IEEE International Conference on Robotics and Automation", area: "Robotics", rank: "CCF-B",
    deadline: "2026-09-15" + AOE, confDate: "2027-06", place: "TBD", link: "https://www.icra2027.org" },
  { name: "RSS 2027", fullName: "Robotics: Science and Systems", area: "Robotics", rank: "Non-CCF",
    deadline: "2027-01-29" + AOE, confDate: "2027-07", place: "TBD", link: "https://roboticsconference.org" },
  { name: "CoRL 2027", fullName: "Conference on Robot Learning", area: "Robotics", rank: "Non-CCF",
    deadline: "2027-06-04" + AOE, confDate: "2027-11", place: "TBD", link: "https://corl.org" },

  // ================= 计算机视觉 CV =================
  { name: "CVPR 2027", fullName: "IEEE/CVF Conference on Computer Vision and Pattern Recognition", area: "CV", rank: "CCF-A",
    deadline: "2026-11-13" + PT, confDate: "2027-06", place: "TBD (USA)", link: "https://cvpr.thecvf.com" },
  { name: "ICCV 2027", fullName: "IEEE/CVF International Conference on Computer Vision", area: "CV", rank: "CCF-A",
    deadline: "2027-03-08" + PT, confDate: "2027-10", place: "TBD", link: "https://iccv.thecvf.com" },
  { name: "ECCV 2028", fullName: "European Conference on Computer Vision", area: "CV", rank: "CCF-B",
    deadline: "2028-03-05" + AOE, confDate: "2028-09", place: "TBD", link: "https://eccv.ecva.net" },
  { name: "WACV 2027", fullName: "IEEE/CVF Winter Conference on Applications of Computer Vision", area: "CV", rank: "Non-CCF",
    deadline: "2026-07-25" + PT, confDate: "2027-03", place: "TBD (USA)", link: "https://wacv2027.thecvf.com" },
  { name: "BMVC 2027", fullName: "British Machine Vision Conference", area: "CV", rank: "CCF-C",
    deadline: "2027-05-20" + AOE, confDate: "2027-11", place: "TBD (UK)", link: "https://bmvc2027.org" },

  // ================= 自然语言处理 NLP =================
  { name: "ACL 2027 (ARR)", fullName: "Annual Meeting of the Association for Computational Linguistics", area: "NLP", rank: "CCF-A",
    deadline: "2027-02-15" + AOE, confDate: "2027-07", place: "TBD", link: "https://aclrollingreview.org" },
  { name: "EMNLP 2026 (ARR)", fullName: "Conference on Empirical Methods in Natural Language Processing", area: "NLP", rank: "CCF-B",
    deadline: "2026-05-19" + AOE, confDate: "2026-11", place: "TBD", link: "https://aclrollingreview.org" },
  { name: "NAACL 2027 (ARR)", fullName: "Conference of the North American Chapter of the ACL", area: "NLP", rank: "CCF-C",
    deadline: "2026-10-05" + AOE, confDate: "2027-04", place: "TBD", link: "https://aclrollingreview.org" },
  { name: "COLING 2027", fullName: "International Conference on Computational Linguistics", area: "NLP", rank: "CCF-B",
    deadline: "2026-09-15" + AOE, confDate: "2027-01", place: "TBD", link: "https://coling2027.org" },

  // ================= 语音 Speech =================
  { name: "INTERSPEECH 2027", fullName: "Conference of the International Speech Communication Association", area: "Speech", rank: "CCF-C",
    deadline: "2027-03-01" + AOE, confDate: "2027-09", place: "TBD", link: "https://interspeech2027.org" },
  { name: "ICASSP 2027", fullName: "IEEE International Conference on Acoustics, Speech and Signal Processing", area: "Speech", rank: "CCF-B",
    deadline: "2026-09-17" + AOE, confDate: "2027-04", place: "TBD", link: "https://2027.ieeeicassp.org" },

  // ================= 数据挖掘 / 信息检索 =================
  { name: "KDD 2027 (Cycle 1)", fullName: "ACM SIGKDD Conference on Knowledge Discovery and Data Mining", area: "Data Mining", rank: "CCF-A",
    deadline: "2026-08-05" + AOE, confDate: "2027-08", place: "TBD", link: "https://kdd.org" },
  { name: "WWW 2027", fullName: "The ACM Web Conference", area: "Data Mining", rank: "CCF-A",
    abstractDeadline: "2026-10-07" + AOE, deadline: "2026-10-14" + AOE, confDate: "2027-05", place: "TBD", link: "https://thewebconf.org" },
  { name: "SIGIR 2027", fullName: "International ACM SIGIR Conference on Research and Development in Information Retrieval", area: "Data Mining", rank: "CCF-A",
    deadline: "2027-01-20" + AOE, confDate: "2027-07", place: "TBD", link: "https://sigir.org" },
  { name: "WSDM 2027", fullName: "ACM International Conference on Web Search and Data Mining", area: "Data Mining", rank: "CCF-B",
    deadline: "2026-08-08" + AOE, confDate: "2027-02", place: "TBD", link: "https://wsdm-conference.org" },
  { name: "CIKM 2027", fullName: "ACM International Conference on Information and Knowledge Management", area: "Data Mining", rank: "CCF-B",
    deadline: "2027-05-25" + AOE, confDate: "2027-11", place: "TBD", link: "https://cikmconference.org" },
  { name: "RecSys 2027", fullName: "ACM Conference on Recommender Systems", area: "Data Mining", rank: "CCF-B",
    deadline: "2027-04-10" + AOE, confDate: "2027-09", place: "TBD", link: "https://recsys.acm.org" },
  { name: "ICDM 2027", fullName: "IEEE International Conference on Data Mining", area: "Data Mining", rank: "CCF-B",
    deadline: "2027-06-10" + AOE, confDate: "2027-12", place: "TBD", link: "https://icdm2027.org" },

  // ================= 数据库 DB =================
  { name: "SIGMOD 2027", fullName: "ACM SIGMOD International Conference on Management of Data", area: "DB", rank: "CCF-A",
    deadline: "2026-07-15" + AOE, confDate: "2027-06", place: "TBD", link: "https://sigmod.org" },
  { name: "VLDB 2027", fullName: "International Conference on Very Large Data Bases（每月 1 日滚动截稿）", area: "DB", rank: "CCF-A",
    deadline: "2027-03-01" + AOE, confDate: "2027-09", place: "TBD", link: "https://vldb.org" },
  { name: "ICDE 2027", fullName: "IEEE International Conference on Data Engineering", area: "DB", rank: "CCF-A",
    deadline: "2026-10-08" + AOE, confDate: "2027-05", place: "TBD", link: "https://icde2027.org" },

  // ================= 系统 Systems =================
  { name: "SOSP 2027", fullName: "ACM Symposium on Operating Systems Principles", area: "Systems", rank: "CCF-A",
    deadline: "2027-04-17" + AOE, confDate: "2027-10", place: "TBD", link: "https://sosp.org" },
  { name: "OSDI 2027", fullName: "USENIX Symposium on Operating Systems Design and Implementation", area: "Systems", rank: "CCF-A",
    deadline: "2026-12-10" + PT, confDate: "2027-07", place: "TBD", link: "https://usenix.org/conference/osdi27" },
  { name: "NSDI 2027 (Fall)", fullName: "USENIX Symposium on Networked Systems Design and Implementation", area: "Systems", rank: "CCF-A",
    deadline: "2026-09-10" + PT, confDate: "2027-04", place: "TBD", link: "https://usenix.org/conference/nsdi27" },
  { name: "USENIX ATC 2027", fullName: "USENIX Annual Technical Conference", area: "Systems", rank: "CCF-A",
    deadline: "2027-01-12" + PT, confDate: "2027-07", place: "TBD", link: "https://usenix.org/conference/atc27" },
  { name: "EuroSys 2027 (Fall)", fullName: "European Conference on Computer Systems", area: "Systems", rank: "CCF-A",
    deadline: "2026-09-24" + AOE, confDate: "2027-04", place: "TBD (Europe)", link: "https://eurosys.org" },
  { name: "ASPLOS 2027", fullName: "ACM International Conference on Architectural Support for Programming Languages and Operating Systems", area: "Systems", rank: "CCF-A",
    deadline: "2026-10-15" + AOE, confDate: "2027-03", place: "TBD", link: "https://asplos-conference.org" },

  // ================= 体系结构 / 高性能计算 =================
  { name: "ISCA 2027", fullName: "International Symposium on Computer Architecture", area: "Arch/HPC", rank: "CCF-A",
    deadline: "2026-11-20" + AOE, confDate: "2027-06", place: "TBD", link: "https://iscaconf.org" },
  { name: "MICRO 2027", fullName: "IEEE/ACM International Symposium on Microarchitecture", area: "Arch/HPC", rank: "CCF-A",
    deadline: "2027-04-15" + AOE, confDate: "2027-10", place: "TBD", link: "https://microarch.org" },
  { name: "HPCA 2027", fullName: "IEEE International Symposium on High-Performance Computer Architecture", area: "Arch/HPC", rank: "CCF-A",
    deadline: "2026-08-01" + AOE, confDate: "2027-02", place: "TBD", link: "https://hpca-conf.org" },
  { name: "SC 2027", fullName: "International Conference for High Performance Computing, Networking, Storage and Analysis", area: "Arch/HPC", rank: "CCF-A",
    deadline: "2027-04-05" + AOE, confDate: "2027-11", place: "TBD (USA)", link: "https://supercomputing.org" },
  { name: "PPoPP 2027", fullName: "ACM SIGPLAN Symposium on Principles and Practice of Parallel Programming", area: "Arch/HPC", rank: "CCF-A",
    deadline: "2026-08-10" + AOE, confDate: "2027-02", place: "TBD", link: "https://ppopp27.sigplan.org" },

  // ================= 网络 Networking =================
  { name: "SIGCOMM 2027", fullName: "ACM SIGCOMM Conference", area: "Networking", rank: "CCF-A",
    deadline: "2027-01-30" + AOE, confDate: "2027-08", place: "TBD", link: "https://sigcomm.org" },
  { name: "INFOCOM 2027", fullName: "IEEE International Conference on Computer Communications", area: "Networking", rank: "CCF-A",
    deadline: "2026-08-01" + AOE, confDate: "2027-05", place: "TBD", link: "https://infocom2027.ieee-infocom.org" },
  { name: "MobiCom 2027", fullName: "ACM International Conference on Mobile Computing and Networking", area: "Networking", rank: "CCF-A",
    deadline: "2026-08-15" + AOE, confDate: "2027-10", place: "TBD", link: "https://sigmobile.org/mobicom" },
  { name: "IMC 2027", fullName: "ACM Internet Measurement Conference", area: "Networking", rank: "CCF-B",
    deadline: "2027-05-10" + AOE, confDate: "2027-11", place: "TBD", link: "https://conferences.sigcomm.org/imc" },

  // ================= 安全 Security =================
  { name: "IEEE S&P 2027", fullName: "IEEE Symposium on Security and Privacy", area: "Security", rank: "CCF-A",
    deadline: "2026-11-14" + AOE, confDate: "2027-05", place: "San Francisco", link: "https://sp2027.ieee-security.org" },
  { name: "USENIX Security 2027", fullName: "USENIX Security Symposium", area: "Security", rank: "CCF-A",
    deadline: "2027-02-05" + AOE, confDate: "2027-08", place: "TBD", link: "https://usenix.org/conference/usenixsecurity27" },
  { name: "ACM CCS 2027", fullName: "ACM Conference on Computer and Communications Security", area: "Security", rank: "CCF-A",
    deadline: "2027-01-14" + AOE, confDate: "2027-11", place: "TBD", link: "https://sigsac.org/ccs.html" },
  { name: "NDSS 2027 (Summer)", fullName: "Network and Distributed System Security Symposium", area: "Security", rank: "CCF-A",
    deadline: "2026-07-23" + AOE, confDate: "2027-02", place: "San Diego", link: "https://ndss-symposium.org" },

  // ================= 软件工程 SE =================
  { name: "ICSE 2028", fullName: "International Conference on Software Engineering", area: "SE", rank: "CCF-A",
    deadline: "2027-03-15" + AOE, confDate: "2028-05", place: "TBD", link: "https://conf.researchr.org/series/icse" },
  { name: "FSE 2027", fullName: "ACM International Conference on the Foundations of Software Engineering", area: "SE", rank: "CCF-A",
    deadline: "2026-09-10" + AOE, confDate: "2027-06", place: "TBD", link: "https://conf.researchr.org/series/fse" },
  { name: "ASE 2027", fullName: "IEEE/ACM International Conference on Automated Software Engineering", area: "SE", rank: "CCF-A",
    deadline: "2027-05-28" + AOE, confDate: "2027-11", place: "TBD", link: "https://conf.researchr.org/series/ase" },
  { name: "ISSTA 2027", fullName: "ACM SIGSOFT International Symposium on Software Testing and Analysis", area: "SE", rank: "CCF-A",
    deadline: "2027-01-28" + AOE, confDate: "2027-07", place: "TBD", link: "https://conf.researchr.org/series/issta" },

  // ================= 人机交互 HCI =================
  { name: "CHI 2027", fullName: "ACM Conference on Human Factors in Computing Systems", area: "HCI", rank: "CCF-A",
    deadline: "2026-09-10" + AOE, confDate: "2027-05", place: "TBD", link: "https://chi2027.acm.org" },
  { name: "UIST 2027", fullName: "ACM Symposium on User Interface Software and Technology", area: "HCI", rank: "CCF-A",
    deadline: "2027-04-02" + AOE, confDate: "2027-10", place: "TBD", link: "https://uist.acm.org" },
  { name: "CSCW 2027", fullName: "ACM Conference on Computer-Supported Cooperative Work（季度滚动）", area: "HCI", rank: "CCF-A",
    deadline: "2027-01-15" + AOE, confDate: "2027-11", place: "TBD", link: "https://cscw.acm.org" },
  { name: "UbiComp/IMWUT 2027", fullName: "ACM International Joint Conference on Pervasive and Ubiquitous Computing（季度滚动）", area: "HCI", rank: "CCF-A",
    deadline: "2026-08-01" + AOE, confDate: "2027-10", place: "TBD", link: "https://ubicomp.org" },

  // ================= 图形学 Graphics =================
  { name: "SIGGRAPH 2027", fullName: "ACM SIGGRAPH Annual Conference", area: "Graphics", rank: "CCF-A",
    deadline: "2027-01-22" + PT, confDate: "2027-08", place: "TBD", link: "https://siggraph.org" },
  { name: "SIGGRAPH Asia 2027", fullName: "ACM SIGGRAPH Conference and Exhibition on Computer Graphics and Interactive Techniques in Asia", area: "Graphics", rank: "CCF-A",
    deadline: "2027-05-19" + AOE, confDate: "2027-12", place: "TBD (Asia)", link: "https://asia.siggraph.org" },
  { name: "Eurographics 2027", fullName: "Annual Conference of the European Association for Computer Graphics", area: "Graphics", rank: "CCF-B",
    deadline: "2026-10-09" + AOE, confDate: "2027-05", place: "TBD (Europe)", link: "https://eg2027.eu" },

  // ================= 理论 Theory =================
  { name: "STOC 2027", fullName: "ACM Symposium on Theory of Computing", area: "Theory", rank: "CCF-A",
    deadline: "2026-11-03" + AOE, confDate: "2027-06", place: "TBD", link: "https://acm-stoc.org" },
  { name: "FOCS 2027", fullName: "IEEE Symposium on Foundations of Computer Science", area: "Theory", rank: "CCF-A",
    deadline: "2027-04-10" + AOE, confDate: "2027-10", place: "TBD", link: "https://focs.computer.org" },
  { name: "SODA 2027", fullName: "ACM-SIAM Symposium on Discrete Algorithms", area: "Theory", rank: "CCF-B",
    deadline: "2026-07-06" + AOE, confDate: "2027-01", place: "TBD", link: "https://siam.org/conferences/cm/conference/soda27" },

  // ================= 多媒体 Multimedia =================
  { name: "ACM MM 2027", fullName: "ACM International Conference on Multimedia", area: "Multimedia", rank: "CCF-A",
    deadline: "2027-04-10" + AOE, confDate: "2027-10", place: "TBD", link: "https://acmmm.org" },
];

// ================= 近 5 年历史 DDL（全文截稿，大致日期 ±数天） =================
// ⚠️ 凭往年周期整理的参考数据，用于把握各会议的 DDL 规律（几月截稿、是否稳定）；
// 精确历史请查官网或 ccfddl（github.com/ccfddl/ccf-deadlines）
const DDL_HISTORY = {
  "NeurIPS":      ["2022-05-19", "2023-05-17", "2024-05-22", "2025-05-15", "2026-05-15"],
  "ICML":         ["2022-01-27", "2023-01-26", "2024-02-01", "2025-01-30", "2026-01-28"],
  "ICLR":         ["2022-09-28", "2023-09-28", "2024-10-01", "2025-09-19"],
  "CVPR":         ["2022-11-11", "2023-11-17", "2024-11-15", "2025-11-14"],
  "ICCV":         ["2021-03-17", "2023-03-08", "2025-03-08"],
  "AAAI":         ["2022-08-15", "2023-08-15", "2024-08-15", "2025-08-01"],
  "IJCAI":        ["2023-01-18", "2024-01-17", "2025-01-16", "2026-01-15"],
  "ACL":          ["2024-02-15", "2025-02-15", "2026-02-15"],
  "EMNLP":        ["2022-06-24", "2023-06-23", "2024-06-15", "2025-05-19", "2026-05-19"],
  "KDD":          ["2022-02-10", "2023-02-02", "2024-02-08", "2025-02-10"],
  "WWW":          ["2021-10-21", "2022-10-13", "2023-10-13", "2024-10-14", "2025-10-15"],
  "SIGIR":        ["2022-01-28", "2023-02-01", "2024-01-25", "2025-01-23"],
  "CHI":          ["2021-09-09", "2022-09-15", "2023-09-13", "2024-09-12", "2025-09-11"],
  "ICRA":         ["2022-09-15", "2023-09-15", "2024-09-15", "2025-09-15"],
  "IROS":         ["2022-03-01", "2023-03-01", "2024-03-01", "2025-03-01", "2026-03-02"],
  "ICASSP":       ["2022-10-26", "2023-09-06", "2024-09-10", "2025-09-17"],
  "INTERSPEECH":  ["2022-03-21", "2023-03-01", "2024-03-02", "2025-03-03"],
  "SIGGRAPH 20":  ["2022-01-27", "2023-01-24", "2024-01-24", "2025-01-23"],
  "OSDI":         ["2022-12-06", "2023-12-07", "2024-12-10", "2025-12-10"],
  "SOSP":         ["2023-04-17", "2024-04-17", "2025-04-17"],
};

// ================= CORE 等级（国际会议分级，英文界面使用） =================
// ⚠️ 基于 CORE2023 整理的近似数据，请以 portal.core.edu.au 最新结果为准
const CORE_RANKS = {
  "NeurIPS": "A*", "ICLR": "A*", "ICML": "A*", "AAAI": "A*", "IJCAI": "A*",
  "AISTATS": "A", "COLT": "A*", "UAI": "A", "AAMAS": "A*", "ECAI": "A",
  "IROS": "A", "ICRA": "A*", "RSS": "A*", "CoRL": "A",
  "CVPR": "A*", "ICCV": "A*", "ECCV": "A*", "WACV": "A", "BMVC": "A",
  "ACL": "A*", "EMNLP": "A*", "NAACL": "A", "COLING": "B",
  "INTERSPEECH": "A", "ICASSP": "B",
  "KDD": "A*", "WWW": "A*", "SIGIR": "A*", "WSDM": "A*", "CIKM": "A",
  "RecSys": "A", "ICDM": "A*",
  "SIGMOD": "A*", "VLDB": "A*", "ICDE": "A*",
  "SOSP": "A*", "OSDI": "A*", "NSDI": "A*", "USENIX ATC": "A",
  "EuroSys": "A", "ASPLOS": "A*",
  "ISCA": "A*", "MICRO": "A*", "HPCA": "A*", "SC": "A", "PPoPP": "A",
  "SIGCOMM": "A*", "INFOCOM": "A*", "MobiCom": "A*", "IMC": "A",
  "IEEE S&P": "A*", "USENIX Security": "A*", "ACM CCS": "A*", "NDSS": "A*",
  "ICSE": "A*", "FSE": "A*", "ASE": "A*", "ISSTA": "A",
  "CHI": "A*", "UIST": "A*", "CSCW": "A", "UbiComp/IMWUT": "A*",
  "SIGGRAPH": "A*", "SIGGRAPH Asia": "A", "Eurographics": "A",
  "STOC": "A*", "FOCS": "A*", "SODA": "A*",
  "ACM MM": "A*",
};

// 按会议名前缀把历史 DDL / CORE 等级挂到对应会议上（取最长匹配前缀）
CONFERENCES.forEach((c) => {
  const key = Object.keys(DDL_HISTORY).find((k) => c.name.startsWith(k));
  if (key) c.history = DDL_HISTORY[key];
  const coreKey = Object.keys(CORE_RANKS)
    .filter((k) => c.name.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  c.core = coreKey ? CORE_RANKS[coreKey] : "Unranked";
});
