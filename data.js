// ⚠️ 本文件由 scripts/build.js 自动生成，请勿手改！
// 数据源在 data/conferences/*.yml —— 改完运行 npm run build（CI 也会自动重建）
const CONFERENCES = [
  {
    "name": "AAAI 2027",
    "fullName": "AAAI Conference on Artificial Intelligence",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "A*",
    "abstractDeadline": "2026-07-25T23:59:59-12:00",
    "deadline": "2026-08-01T23:59:59-12:00",
    "confDate": "2027-01",
    "place": "TBD",
    "link": "https://aaai.org",
    "history": [
      "2022-08-15",
      "2023-08-15",
      "2024-08-15",
      "2025-08-01"
    ]
  },
  {
    "name": "AAMAS 2027",
    "fullName": "International Conference on Autonomous Agents and Multiagent Systems",
    "area": "AI/ML",
    "rank": "CCF-B",
    "core": "A*",
    "abstractDeadline": "2026-10-01T23:59:59-12:00",
    "deadline": "2026-10-08T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD",
    "link": "https://aamas-conference.org"
  },
  {
    "name": "ACL 2027 (ARR)",
    "fullName": "Annual Meeting of the Association for Computational Linguistics",
    "area": "NLP",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-02-15T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://aclrollingreview.org",
    "history": [
      "2024-02-15",
      "2025-02-15",
      "2026-02-15"
    ]
  },
  {
    "name": "ACM CCS 2027",
    "fullName": "ACM Conference on Computer and Communications Security",
    "area": "Security",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-14T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://sigsac.org/ccs.html",
    "aliases": [
      "CCS"
    ]
  },
  {
    "name": "ACM MM 2027",
    "fullName": "ACM International Conference on Multimedia",
    "area": "Multimedia",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-04-10T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://acmmm.org",
    "aliases": [
      "MM",
      "MultiMedia"
    ]
  },
  {
    "name": "AISTATS 2027",
    "fullName": "International Conference on Artificial Intelligence and Statistics",
    "area": "AI/ML",
    "rank": "CCF-C",
    "core": "A",
    "abstractDeadline": "2026-10-01T23:59:59-12:00",
    "deadline": "2026-10-08T23:59:59-12:00",
    "confDate": "2027-04",
    "place": "TBD",
    "link": "https://aistats.org"
  },
  {
    "name": "ASE 2027",
    "fullName": "IEEE/ACM International Conference on Automated Software Engineering",
    "area": "SE",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-05-28T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://conf.researchr.org/series/ase"
  },
  {
    "name": "ASPLOS 2027",
    "fullName": "ACM International Conference on Architectural Support for Programming Languages and Operating Systems",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-10-15T23:59:59-12:00",
    "confDate": "2027-03",
    "place": "TBD",
    "link": "https://asplos-conference.org"
  },
  {
    "name": "BMVC 2027",
    "fullName": "British Machine Vision Conference",
    "area": "CV",
    "rank": "CCF-C",
    "core": "A",
    "deadline": "2027-05-20T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD (UK)",
    "link": "https://bmvc2027.org"
  },
  {
    "name": "CHI 2027",
    "fullName": "ACM Conference on Human Factors in Computing Systems",
    "area": "HCI",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-09-10T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD",
    "link": "https://chi2027.acm.org",
    "history": [
      "2021-09-09",
      "2022-09-15",
      "2023-09-13",
      "2024-09-12",
      "2025-09-11"
    ]
  },
  {
    "name": "CIKM 2027",
    "fullName": "ACM International Conference on Information and Knowledge Management",
    "area": "Data Mining",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2027-05-25T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://cikmconference.org"
  },
  {
    "name": "COLING 2027",
    "fullName": "International Conference on Computational Linguistics",
    "area": "NLP",
    "rank": "CCF-B",
    "core": "B",
    "deadline": "2026-09-15T23:59:59-12:00",
    "confDate": "2027-01",
    "place": "TBD",
    "link": "https://coling2027.org"
  },
  {
    "name": "COLT 2027",
    "fullName": "Conference on Learning Theory",
    "area": "AI/ML",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2027-02-10T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://learningtheory.org"
  },
  {
    "name": "CoRL 2027",
    "fullName": "Conference on Robot Learning",
    "area": "Robotics",
    "rank": "Non-CCF",
    "core": "A",
    "deadline": "2027-06-04T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://corl.org"
  },
  {
    "name": "CSCW 2027",
    "fullName": "ACM Conference on Computer-Supported Cooperative Work（季度滚动）",
    "area": "HCI",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2027-01-15T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://cscw.acm.org"
  },
  {
    "name": "CVPR 2027",
    "fullName": "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
    "area": "CV",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-11-13T23:59:59-08:00",
    "confDate": "2027-06",
    "place": "TBD (USA)",
    "link": "https://cvpr.thecvf.com",
    "history": [
      "2022-11-11",
      "2023-11-17",
      "2024-11-15",
      "2025-11-14"
    ]
  },
  {
    "name": "ECAI 2027",
    "fullName": "European Conference on Artificial Intelligence",
    "area": "AI/ML",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2027-01-20T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://ecai2027.eu"
  },
  {
    "name": "ECCV 2028",
    "fullName": "European Conference on Computer Vision",
    "area": "CV",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2028-03-05T23:59:59-12:00",
    "confDate": "2028-09",
    "place": "TBD",
    "link": "https://eccv.ecva.net"
  },
  {
    "name": "EMNLP 2026 (ARR)",
    "fullName": "Conference on Empirical Methods in Natural Language Processing",
    "area": "NLP",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2026-05-19T23:59:59-12:00",
    "confDate": "2026-11",
    "place": "TBD",
    "link": "https://aclrollingreview.org",
    "history": [
      "2022-06-24",
      "2023-06-23",
      "2024-06-15",
      "2025-05-19",
      "2026-05-19"
    ]
  },
  {
    "name": "Eurographics 2027",
    "fullName": "Annual Conference of the European Association for Computer Graphics",
    "area": "Graphics",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2026-10-09T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD (Europe)",
    "link": "https://eg2027.eu"
  },
  {
    "name": "EuroSys 2027 (Fall)",
    "fullName": "European Conference on Computer Systems",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2026-09-24T23:59:59-12:00",
    "confDate": "2027-04",
    "place": "TBD (Europe)",
    "link": "https://eurosys.org"
  },
  {
    "name": "FOCS 2027",
    "fullName": "IEEE Symposium on Foundations of Computer Science",
    "area": "Theory",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-04-10T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://focs.computer.org"
  },
  {
    "name": "FSE 2027",
    "fullName": "ACM International Conference on the Foundations of Software Engineering",
    "area": "SE",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-09-10T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://conf.researchr.org/series/fse",
    "aliases": [
      "ESEC/FSE"
    ]
  },
  {
    "name": "HPCA 2027",
    "fullName": "IEEE International Symposium on High-Performance Computer Architecture",
    "area": "Arch/HPC",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-08-01T23:59:59-12:00",
    "confDate": "2027-02",
    "place": "TBD",
    "link": "https://hpca-conf.org"
  },
  {
    "name": "ICASSP 2027",
    "fullName": "IEEE International Conference on Acoustics, Speech and Signal Processing",
    "area": "Speech",
    "rank": "CCF-B",
    "core": "B",
    "deadline": "2026-09-17T23:59:59-12:00",
    "confDate": "2027-04",
    "place": "TBD",
    "link": "https://2027.ieeeicassp.org",
    "history": [
      "2022-10-26",
      "2023-09-06",
      "2024-09-10",
      "2025-09-17"
    ]
  },
  {
    "name": "ICCV 2027",
    "fullName": "IEEE/CVF International Conference on Computer Vision",
    "area": "CV",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-03-08T23:59:59-08:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://iccv.thecvf.com",
    "history": [
      "2021-03-17",
      "2023-03-08",
      "2025-03-08"
    ]
  },
  {
    "name": "ICDE 2027",
    "fullName": "IEEE International Conference on Data Engineering",
    "area": "DB",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-10-08T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD",
    "link": "https://icde2027.org"
  },
  {
    "name": "ICDM 2027",
    "fullName": "IEEE International Conference on Data Mining",
    "area": "Data Mining",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2027-06-10T23:59:59-12:00",
    "confDate": "2027-12",
    "place": "TBD",
    "link": "https://icdm2027.org"
  },
  {
    "name": "ICLR 2027",
    "fullName": "International Conference on Learning Representations",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "A*",
    "abstractDeadline": "2026-09-18T23:59:59-12:00",
    "deadline": "2026-09-24T23:59:59-12:00",
    "confDate": "2027-04",
    "place": "TBD",
    "link": "https://iclr.cc",
    "history": [
      "2022-09-28",
      "2023-09-28",
      "2024-10-01",
      "2025-09-19"
    ]
  },
  {
    "name": "ICML 2027",
    "fullName": "International Conference on Machine Learning",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-28T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://icml.cc",
    "history": [
      "2022-01-27",
      "2023-01-26",
      "2024-02-01",
      "2025-01-30",
      "2026-01-28"
    ]
  },
  {
    "name": "ICRA 2027",
    "fullName": "IEEE International Conference on Robotics and Automation",
    "area": "Robotics",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2026-09-15T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://www.icra2027.org",
    "history": [
      "2022-09-15",
      "2023-09-15",
      "2024-09-15",
      "2025-09-15"
    ]
  },
  {
    "name": "ICSE 2028",
    "fullName": "International Conference on Software Engineering",
    "area": "SE",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-03-15T23:59:59-12:00",
    "confDate": "2028-05",
    "place": "TBD",
    "link": "https://conf.researchr.org/series/icse"
  },
  {
    "name": "IEEE S&P 2027",
    "fullName": "IEEE Symposium on Security and Privacy",
    "area": "Security",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-11-14T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "San Francisco",
    "link": "https://sp2027.ieee-security.org",
    "aliases": [
      "Oakland",
      "S&P",
      "SP"
    ]
  },
  {
    "name": "IJCAI 2027",
    "fullName": "International Joint Conference on Artificial Intelligence",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-15T23:59:59-12:00",
    "confDate": "2027-08",
    "place": "TBD",
    "link": "https://ijcai.org",
    "history": [
      "2023-01-18",
      "2024-01-17",
      "2025-01-16",
      "2026-01-15"
    ]
  },
  {
    "name": "IJCV",
    "type": "journal",
    "rolling": true,
    "fullName": "International Journal of Computer Vision",
    "area": "CV",
    "rank": "CCF-A",
    "core": "Unranked",
    "link": "https://link.springer.com/journal/11263"
  },
  {
    "name": "IMC 2027",
    "fullName": "ACM Internet Measurement Conference",
    "area": "Networking",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2027-05-10T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD",
    "link": "https://conferences.sigcomm.org/imc"
  },
  {
    "name": "INFOCOM 2027",
    "fullName": "IEEE International Conference on Computer Communications",
    "area": "Networking",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-08-01T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD",
    "link": "https://infocom2027.ieee-infocom.org"
  },
  {
    "name": "INTERSPEECH 2027",
    "fullName": "Conference of the International Speech Communication Association",
    "area": "Speech",
    "rank": "CCF-C",
    "core": "A",
    "deadline": "2027-03-01T23:59:59-12:00",
    "confDate": "2027-09",
    "place": "TBD",
    "link": "https://interspeech2027.org",
    "history": [
      "2022-03-21",
      "2023-03-01",
      "2024-03-02",
      "2025-03-03"
    ],
    "aliases": [
      "IS"
    ]
  },
  {
    "name": "IROS 2027",
    "fullName": "IEEE/RSJ International Conference on Intelligent Robots and Systems",
    "area": "Robotics",
    "rank": "CCF-C",
    "core": "A",
    "deadline": "2027-03-01T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://www.iros.org",
    "history": [
      "2022-03-01",
      "2023-03-01",
      "2024-03-01",
      "2025-03-01",
      "2026-03-02"
    ]
  },
  {
    "name": "ISCA 2027",
    "fullName": "International Symposium on Computer Architecture",
    "area": "Arch/HPC",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-11-20T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://iscaconf.org"
  },
  {
    "name": "ISSTA 2027",
    "fullName": "ACM SIGSOFT International Symposium on Software Testing and Analysis",
    "area": "SE",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2027-01-28T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://conf.researchr.org/series/issta"
  },
  {
    "name": "JMLR",
    "type": "journal",
    "rolling": true,
    "fullName": "Journal of Machine Learning Research",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "Unranked",
    "link": "https://jmlr.org"
  },
  {
    "name": "KDD 2027 (Cycle 1)",
    "fullName": "ACM SIGKDD Conference on Knowledge Discovery and Data Mining",
    "area": "Data Mining",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-08-05T23:59:59-12:00",
    "confDate": "2027-08",
    "place": "TBD",
    "link": "https://kdd.org",
    "history": [
      "2022-02-10",
      "2023-02-02",
      "2024-02-08",
      "2025-02-10"
    ]
  },
  {
    "name": "MICRO 2027",
    "fullName": "IEEE/ACM International Symposium on Microarchitecture",
    "area": "Arch/HPC",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-04-15T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://microarch.org"
  },
  {
    "name": "MobiCom 2027",
    "fullName": "ACM International Conference on Mobile Computing and Networking",
    "area": "Networking",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-08-15T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://sigmobile.org/mobicom"
  },
  {
    "name": "NAACL 2027 (ARR)",
    "fullName": "Conference of the North American Chapter of the ACL",
    "area": "NLP",
    "rank": "CCF-C",
    "core": "A",
    "deadline": "2026-10-05T23:59:59-12:00",
    "confDate": "2027-04",
    "place": "TBD",
    "link": "https://aclrollingreview.org"
  },
  {
    "name": "NDSS 2027 (Summer)",
    "fullName": "Network and Distributed System Security Symposium",
    "area": "Security",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-07-23T23:59:59-12:00",
    "confDate": "2027-02",
    "place": "San Diego",
    "link": "https://ndss-symposium.org"
  },
  {
    "name": "NeurIPS 2026",
    "fullName": "Conference on Neural Information Processing Systems",
    "area": "AI/ML",
    "rank": "CCF-A",
    "core": "A*",
    "abstractDeadline": "2026-05-11T23:59:59-12:00",
    "deadline": "2026-05-15T23:59:59-12:00",
    "confDate": "2026-12",
    "place": "TBD",
    "link": "https://neurips.cc",
    "history": [
      "2022-05-19",
      "2023-05-17",
      "2024-05-22",
      "2025-05-15",
      "2026-05-15"
    ],
    "aliases": [
      "NIPS"
    ]
  },
  {
    "name": "NSDI 2027 (Fall)",
    "fullName": "USENIX Symposium on Networked Systems Design and Implementation",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-09-10T23:59:59-08:00",
    "confDate": "2027-04",
    "place": "TBD",
    "link": "https://usenix.org/conference/nsdi27"
  },
  {
    "name": "OSDI 2027",
    "fullName": "USENIX Symposium on Operating Systems Design and Implementation",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-12-10T23:59:59-08:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://usenix.org/conference/osdi27",
    "history": [
      "2022-12-06",
      "2023-12-07",
      "2024-12-10",
      "2025-12-10"
    ]
  },
  {
    "name": "PPoPP 2027",
    "fullName": "ACM SIGPLAN Symposium on Principles and Practice of Parallel Programming",
    "area": "Arch/HPC",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2026-08-10T23:59:59-12:00",
    "confDate": "2027-02",
    "place": "TBD",
    "link": "https://ppopp27.sigplan.org"
  },
  {
    "name": "RecSys 2027",
    "fullName": "ACM Conference on Recommender Systems",
    "area": "Data Mining",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2027-04-10T23:59:59-12:00",
    "confDate": "2027-09",
    "place": "TBD",
    "link": "https://recsys.acm.org"
  },
  {
    "name": "RSS 2027",
    "fullName": "Robotics: Science and Systems",
    "area": "Robotics",
    "rank": "Non-CCF",
    "core": "A*",
    "deadline": "2027-01-29T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://roboticsconference.org"
  },
  {
    "name": "SC 2027",
    "fullName": "International Conference for High Performance Computing, Networking, Storage and Analysis",
    "area": "Arch/HPC",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2027-04-05T23:59:59-12:00",
    "confDate": "2027-11",
    "place": "TBD (USA)",
    "link": "https://supercomputing.org"
  },
  {
    "name": "SIGCOMM 2027",
    "fullName": "ACM SIGCOMM Conference",
    "area": "Networking",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-30T23:59:59-12:00",
    "confDate": "2027-08",
    "place": "TBD",
    "link": "https://sigcomm.org"
  },
  {
    "name": "SIGGRAPH 2027",
    "fullName": "ACM SIGGRAPH Annual Conference",
    "area": "Graphics",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-22T23:59:59-08:00",
    "confDate": "2027-08",
    "place": "TBD",
    "link": "https://siggraph.org",
    "history": [
      "2022-01-27",
      "2023-01-24",
      "2024-01-24",
      "2025-01-23"
    ],
    "aliases": [
      "SG"
    ]
  },
  {
    "name": "SIGGRAPH Asia 2027",
    "fullName": "ACM SIGGRAPH Conference and Exhibition on Computer Graphics and Interactive Techniques in Asia",
    "area": "Graphics",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2027-05-19T23:59:59-12:00",
    "confDate": "2027-12",
    "place": "TBD (Asia)",
    "link": "https://asia.siggraph.org"
  },
  {
    "name": "SIGIR 2027",
    "fullName": "International ACM SIGIR Conference on Research and Development in Information Retrieval",
    "area": "Data Mining",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-01-20T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://sigir.org",
    "history": [
      "2022-01-28",
      "2023-02-01",
      "2024-01-25",
      "2025-01-23"
    ]
  },
  {
    "name": "SIGMOD 2027",
    "fullName": "ACM SIGMOD International Conference on Management of Data",
    "area": "DB",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-07-15T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://sigmod.org"
  },
  {
    "name": "SODA 2027",
    "fullName": "ACM-SIAM Symposium on Discrete Algorithms",
    "area": "Theory",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2026-07-06T23:59:59-12:00",
    "confDate": "2027-01",
    "place": "TBD",
    "link": "https://siam.org/conferences/cm/conference/soda27"
  },
  {
    "name": "SOSP 2027",
    "fullName": "ACM Symposium on Operating Systems Principles",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-04-17T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://sosp.org",
    "history": [
      "2023-04-17",
      "2024-04-17",
      "2025-04-17"
    ]
  },
  {
    "name": "STOC 2027",
    "fullName": "ACM Symposium on Theory of Computing",
    "area": "Theory",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-11-03T23:59:59-12:00",
    "confDate": "2027-06",
    "place": "TBD",
    "link": "https://acm-stoc.org"
  },
  {
    "name": "TACL",
    "type": "journal",
    "rolling": true,
    "fullName": "Transactions of the Association for Computational Linguistics",
    "area": "NLP",
    "rank": "CCF-B",
    "core": "Unranked",
    "link": "https://transacl.org"
  },
  {
    "name": "TPAMI",
    "type": "journal",
    "rolling": true,
    "fullName": "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    "area": "CV",
    "rank": "CCF-A",
    "core": "Unranked",
    "link": "https://www.computer.org/csdl/journal/tp"
  },
  {
    "name": "UAI 2027",
    "fullName": "Conference on Uncertainty in Artificial Intelligence",
    "area": "AI/ML",
    "rank": "CCF-B",
    "core": "A",
    "deadline": "2027-02-20T23:59:59-12:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://auai.org"
  },
  {
    "name": "UbiComp/IMWUT 2027",
    "fullName": "ACM International Joint Conference on Pervasive and Ubiquitous Computing（季度滚动）",
    "area": "HCI",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2026-08-01T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://ubicomp.org",
    "aliases": [
      "IMWUT",
      "UbiComp"
    ]
  },
  {
    "name": "UIST 2027",
    "fullName": "ACM Symposium on User Interface Software and Technology",
    "area": "HCI",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-04-02T23:59:59-12:00",
    "confDate": "2027-10",
    "place": "TBD",
    "link": "https://uist.acm.org"
  },
  {
    "name": "USENIX ATC 2027",
    "fullName": "USENIX Annual Technical Conference",
    "area": "Systems",
    "rank": "CCF-A",
    "core": "A",
    "deadline": "2027-01-12T23:59:59-08:00",
    "confDate": "2027-07",
    "place": "TBD",
    "link": "https://usenix.org/conference/atc27"
  },
  {
    "name": "USENIX Security 2027",
    "fullName": "USENIX Security Symposium",
    "area": "Security",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-02-05T23:59:59-12:00",
    "confDate": "2027-08",
    "place": "TBD",
    "link": "https://usenix.org/conference/usenixsecurity27",
    "aliases": [
      "USENIX Sec",
      "Security Symposium"
    ]
  },
  {
    "name": "VLDB 2027",
    "fullName": "International Conference on Very Large Data Bases（每月 1 日滚动截稿）",
    "area": "DB",
    "rank": "CCF-A",
    "core": "A*",
    "deadline": "2027-03-01T23:59:59-12:00",
    "confDate": "2027-09",
    "place": "TBD",
    "link": "https://vldb.org"
  },
  {
    "name": "WACV 2027",
    "fullName": "IEEE/CVF Winter Conference on Applications of Computer Vision",
    "area": "CV",
    "rank": "Non-CCF",
    "core": "A",
    "deadline": "2026-07-25T23:59:59-08:00",
    "confDate": "2027-03",
    "place": "TBD (USA)",
    "link": "https://wacv2027.thecvf.com"
  },
  {
    "name": "WSDM 2027",
    "fullName": "ACM International Conference on Web Search and Data Mining",
    "area": "Data Mining",
    "rank": "CCF-B",
    "core": "A*",
    "deadline": "2026-08-08T23:59:59-12:00",
    "confDate": "2027-02",
    "place": "TBD",
    "link": "https://wsdm-conference.org"
  },
  {
    "name": "WWW 2027",
    "fullName": "The ACM Web Conference",
    "area": "Data Mining",
    "rank": "CCF-A",
    "core": "A*",
    "abstractDeadline": "2026-10-07T23:59:59-12:00",
    "deadline": "2026-10-14T23:59:59-12:00",
    "confDate": "2027-05",
    "place": "TBD",
    "link": "https://thewebconf.org",
    "history": [
      "2021-10-21",
      "2022-10-13",
      "2023-10-13",
      "2024-10-14",
      "2025-10-15"
    ],
    "aliases": [
      "TheWebConf",
      "The Web Conference"
    ]
  }
];
