// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

function showSection(id){
  const isMobile = window.innerWidth <= 768;

  // Determine the actual section to show based on device and input id
  let targetId = id;
  if (isMobile) {
    if (id === 'home') targetId = 'roadmap'; // On mobile, 'home' is an alias for 'roadmap'
  } else {
    if (id === 'home' || id === 'features') targetId = 'roadmap'; // On desktop, 'home' and 'features' are aliases for 'roadmap'
  }

  // Hide all main sections
  document.querySelectorAll("main > section, section").forEach(s => s.style.display = "none");

  // Show the target section
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.style.display = "block";
  } else {
    // Fallback to roadmap if target doesn't exist (e.g., on first load or for 'profile' if not present)
    const roadmapSection = document.getElementById('roadmap');
    if(roadmapSection) roadmapSection.style.display = "block";
    targetId = 'roadmap'; // update id for active state logic
  }

  // Update active navigation states
  if (isMobile) {
    document.querySelectorAll(".mobile-nav-btn").forEach(b => b.classList.remove("active"));
    const mobileBtn = document.querySelector(`.mobile-nav-btn[data-section-id='${targetId}']`);
    if (mobileBtn) mobileBtn.classList.add("active");

    // Close slide-out menu if it's open after selection
    const slideMenu = document.getElementById('mobile-slide-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    if (slideMenu) slideMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('open');
    document.body.style.overflow = '';

  } else {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    const desktopBtn = document.getElementById("btn-" + targetId);
    if (desktopBtn) desktopBtn.classList.add("active");
  }

  // Run feature-specific initializations based on the original requested id
  if(id==="jobs") renderChart();
  if(id==="mentor" && chatHistory.length === 0) initChatSuggestions();
  if(id==="analytics") updateAnalyticsDashboard();
  if(id==="degree-finder") initDegreeFinder();
  if(id==="college-finder") initCollegeFinder();
  if(id==="higher-studies") initHigherStudies();
}

// Wrapper to load the original roadmap section content into home
function loadRoadmap() {
  showSection('roadmap');
}

// ===== ANALYTICS ACTIVITY TRACKER =====
function trackActivity(action, detail) {
  let analytics = JSON.parse(localStorage.getItem('appAnalytics')) || { activityLog: [] };
  if (!analytics.activityLog) analytics.activityLog = [];
  analytics.activityLog.unshift({ time: new Date().toISOString(), action, detail });
  if (analytics.activityLog.length > 50) analytics.activityLog.pop(); // Keep only last 50 activities
  localStorage.setItem('appAnalytics', JSON.stringify(analytics));
  
  // Instantly trigger live dashboard update
  if(typeof updateLiveDashboard === 'function') updateLiveDashboard();
}

const roadmaps={
// ===== UPGRADED 28-ITEM ROADMAP (7 per year) =====
"Web Developer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Learn Internet Basics & Version Control","Master HTML5 Semantics & Accessibility","Master CSS3 Basics, Flexbox, & Grid","Learn JavaScript Basics & DOM Manipulation","Build 3 Simple Static Websites"],2:["Advanced JavaScript (ES6+, Async/Await)","Learn a CSS Framework (Tailwind/Bootstrap)","Master React.js Basics & Hooks","Understand REST APIs & Data Fetching","Build Responsive Dynamic Web Projects"],3:["Learn Node.js & Express.js Fundamentals","Master Relational & NoSQL Databases","Understand RESTful APIs & Authentication","Implement CRUD Operations Securely","Build a Full-Stack Web Application"],4:["Learn TypeScript & Next.js","Learn Docker & Containerization","Deploy on Cloud & CI/CD Pipelines","Understand System Design & Microservices","Build a Large-Scale Production Project"]},
"Frontend Developer":{free:"https://www.w3schools.com",paid:"https://www.udemy.com",1:["Learn HTML5 and Semantic Web","Master CSS3, Flexbox & Grid","Learn JavaScript Fundamentals","DOM Manipulation & Browser APIs","Build static UI pages & Portfolios"],2:["Advanced JavaScript (ES6+, Closures)","Learn React.js or Vue.js Framework","Master Responsive & Tailwind CSS","Work with REST APIs & Data Fetching","Build dynamic frontend projects"],3:["Learn TypeScript for strict typing","Learn Next.js for SSR & SSG","Write Unit Tests (Jest/React Testing)","Learn Webpack/Vite bundlers","Build real-world UI applications"],4:["Master Web Performance Optimization","Learn Progressive Web Apps (PWA)","Learn Micro-Frontends Architecture","Contribute to Open Source Projects","Prepare for Frontend interviews"]},
"Backend Developer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Learn Internet & Networking Basics","Learn Python, Java, or Go basics","Understand Data Structures & Algorithms","Learn Git, Terminal & Linux Command Line","Build CLI-based applications"],2:["Learn a Backend Framework (Node.js/Django)","Master SQL & NoSQL Databases","Build and test RESTful APIs","Understand Authentication (JWT, OAuth)","Build backend APIs for web clients"],3:["Learn GraphQL & gRPC APIs","Learn Message Brokers (RabbitMQ/Kafka)","Master Web Security & Caching (Redis)","Learn Docker & Containerization","Work with Microservices Architecture"],4:["Learn Kubernetes & Orchestration","Learn Cloud Providers (AWS/Azure/GCP)","Learn CI/CD Pipelines & DevOps basics","Master Database Scaling & Sharding","Build production-ready backend project"]},
"Full Stack Developer":{free:"https://www.theodinproject.com",paid:"https://www.udemy.com",
1:[
  {title:"HTML & CSS Foundations",domain:"Frontend",desc:"Learn semantic HTML5, CSS3 layouts, flexbox, grid and responsive design principles.",tools:["VS Code","HTML5","CSS3","Chrome DevTools"],outcome:"Build a fully responsive personal webpage"},
  {title:"JavaScript Essentials",domain:"Frontend",desc:"Master variables, functions, DOM manipulation, events and ES6+ features.",tools:["VS Code","JavaScript","Browser Console"],outcome:"Build interactive UI components"},
  {title:"SQL & Database Basics",domain:"Database",desc:"Understand relational databases, write SQL queries, joins and basic schema design.",tools:["MySQL","DB Browser","VS Code"],outcome:"Design and query a student database"},
  {title:"Git & GitHub Basics",domain:"DevOps",desc:"Learn version control, branching, commits, pull requests and GitHub workflows.",tools:["Git","GitHub","VS Code"],outcome:"Manage code with version control"},
  {title:"Student CRUD App",domain:"Projects",desc:"Build a student management app with add, edit, delete and search functionality.",tools:["HTML","CSS","JavaScript","MySQL"],outcome:"Working full CRUD application"}
],
2:[
  {title:"React.js Framework",domain:"Frontend",desc:"Learn React components, props, state, hooks, routing and reusable UI patterns.",tools:["React","npm","VS Code","React Router"],outcome:"Build a dynamic single-page application"},
  {title:"Node.js & Express APIs",domain:"Backend",desc:"Build RESTful APIs with Express, handle routes, middleware and HTTP methods.",tools:["Node.js","Express","Postman","VS Code"],outcome:"Working REST API with full CRUD"},
  {title:"MongoDB & Mongoose",domain:"Database",desc:"Learn NoSQL database design, schema modeling and connect MongoDB with Node.js.",tools:["MongoDB Atlas","Mongoose","Compass"],outcome:"Database-connected backend API"},
  {title:"Responsive UI with Tailwind",domain:"Frontend",desc:"Build mobile-first responsive interfaces using Tailwind CSS utility classes.",tools:["Tailwind CSS","React","VS Code"],outcome:"Pixel-perfect responsive UI"},
  {title:"Blog Web Application",domain:"Projects",desc:"Full stack blog with React frontend, Node/Express backend and MongoDB database.",tools:["React","Node.js","MongoDB","GitHub"],outcome:"Deployed full stack blog app"},
],
3:[
  {title:"Advanced React Patterns",domain:"Frontend",desc:"Master Redux, Context API, lazy loading, code splitting and performance optimization.",tools:["React","Redux","React Query","VS Code"],outcome:"High-performance optimized React app"},
  {title:"Authentication & Security",domain:"Backend",desc:"Implement JWT, bcrypt password hashing, OAuth2 and role-based access control.",tools:["Node.js","JWT","bcrypt","Passport.js"],outcome:"Fully secured authentication system"},
  {title:"Docker & Containerization",domain:"DevOps",desc:"Containerize frontend and backend apps, write Dockerfiles and use Docker Compose.",tools:["Docker","Docker Compose","VS Code"],outcome:"Fully dockerized full stack app"},
  {title:"AWS EC2 & Deployment",domain:"Cloud",desc:"Deploy Node.js apps on EC2, configure security groups, Nginx reverse proxy and SSL.",tools:["AWS EC2","Nginx","PM2","Let's Encrypt"],outcome:"Live app running on AWS cloud"},
  {title:"Real-Time Chat Application",domain:"Projects",desc:"Build a real-time chat app using WebSockets with rooms, typing indicators and history.",tools:["Socket.io","React","Node.js","MongoDB"],outcome:"Live real-time chat application"},
],
4:[
  {title:"Next.js & Server-Side Rendering",domain:"Frontend",desc:"Build SEO-optimized apps with SSR, SSG, API routes and image optimization in Next.js.",tools:["Next.js","React","Vercel","TypeScript"],outcome:"Production-ready SSR web application"},
  {title:"Microservices Architecture",domain:"Backend",desc:"Decompose monolith into microservices with API Gateway, service discovery and messaging.",tools:["Node.js","Docker","Nginx","RabbitMQ"],outcome:"Scalable microservices backend system"},
  {title:"CI/CD Pipelines",domain:"DevOps",desc:"Automate testing, building and deployment pipelines triggered on every GitHub push.",tools:["GitHub Actions","AWS CodePipeline","Docker"],outcome:"Fully automated deploy pipeline"},
  {title:"SaaS Dashboard Platform",domain:"Projects",desc:"Build a multi-tenant SaaS app with subscription billing, analytics dashboard and role management.",tools:["Next.js","Node.js","AWS","Stripe API","MongoDB"],outcome:"Live monetized SaaS product"},
  {title:"AI-Powered Career Platform",domain:"Projects",desc:"Full stack platform with AI job recommendations, resume builder, skill gap analysis and deployment.",tools:["React","Node.js","MongoDB","Amazon Q","AWS EC2","Docker"],outcome:"Complete deployed AI career platform"}
]},
"Mobile App Developer (Android)":{free:"https://developer.android.com/courses",paid:"https://www.udemy.com",1:["Learn Java or Kotlin","Learn programming basics"],2:["Learn Android Studio","Build simple mobile apps"],3:["Learn APIs and databases","Build advanced Android apps"],4:["Publish app on Play Store","Apply for Android developer jobs"]},
"Mobile App Developer (iOS)":{free:"https://www.hackingwithswift.com",paid:"https://www.udemy.com",1:["Learn Swift programming","Learn programming basics"],2:["Learn Xcode","Build basic iOS apps"],3:["Work with APIs and databases","Build real-world iOS apps"],4:["Publish apps in App Store","Prepare for iOS developer roles"]},
"Game Developer":{free:"https://learn.unity.com",paid:"https://www.gamedev.tv",1:["Learn programming basics (C# or C++)","Learn game design fundamentals"],2:["Learn Unity or Unreal Engine","Build small games"],3:["Learn 3D graphics and physics","Develop advanced games"],4:["Build complete game project","Publish game portfolio"]},
"Software Developer":{free:"https://www.freecodecamp.org",paid:"https://www.coursera.org",1:["Learn C / Python","Learn programming fundamentals"],2:["Learn data structures","Build basic software projects"],3:["Learn system design","Work on real-world software"],4:["Prepare coding interviews","Apply for software developer jobs"]},
"Data Scientist":{free:"https://www.kaggle.com/learn",paid:"https://www.datacamp.com",1:["Learn Python for Data Science","Learn SQL for Data querying","Understand Statistics & Probability","Learn Linear Algebra & Calculus basics","Learn Jupyter Notebooks & Git","Master Data Manipulation with Pandas","Learn Array computations with NumPy"],2:["Learn Data Visualization (Matplotlib, Seaborn)","Learn Exploratory Data Analysis (EDA)","Understand Data Cleaning & Preprocessing","Learn Scikit-Learn for Machine Learning","Build Supervised Learning models (Regression, Classification)","Build Unsupervised Learning models (Clustering)","Participate in basic Kaggle competitions"],3:["Learn Advanced Machine Learning (XGBoost, Random Forest)","Learn Deep Learning basics with TensorFlow/PyTorch","Understand Natural Language Processing (NLP) basics","Learn Time Series Analysis","Learn Model Evaluation & Tuning techniques","Work on real-world Kaggle datasets","Create End-to-End ML pipelines"],4:["Learn Big Data tools (Spark, Hadoop)","Learn Model Deployment (Flask, FastAPI, Docker)","Understand MLOps and Cloud ML (AWS SageMaker)","Learn Advanced Deep Learning (CNNs, RNNs)","Build full-stack Data Science projects","Create a strong Data Science portfolio","Prepare for Data Scientist interviews"]},
"Data Analyst":{free:"https://www.google.com/analytics/learn",paid:"https://www.coursera.org",1:["Learn Excel","Learn statistics basics"],2:["Learn SQL","Learn Power BI / Tableau"],3:["Analyse datasets","Build analytics dashboards"],4:["Build data portfolio","Apply for data analyst jobs"]},
"Machine Learning Engineer":{free:"https://fast.ai",paid:"https://www.coursera.org",1:["Learn Python","Learn math for ML"],2:["Learn ML algorithms","Build small ML projects"],3:["Learn TensorFlow or PyTorch","Develop ML applications"],4:["Deploy ML models","Prepare ML interviews"]},
"Artificial Intelligence Engineer":{free:"https://www.elementsofai.com",paid:"https://www.udacity.com",1:["Learn Python programming deeply","Master Mathematics (Linear Algebra, Calculus)","Learn Statistics and Probability","Understand Data Structures & Algorithms","Learn Data manipulation (Pandas, NumPy)","Learn basic Machine Learning concepts","Build simple AI predictive scripts"],2:["Master Scikit-Learn & Classical ML","Learn Deep Learning fundamentals","Learn Neural Networks (ANNs)","Master TensorFlow or PyTorch frameworks","Learn Computer Vision basics (OpenCV)","Learn NLP basics (NLTK, SpaCy)","Build end-to-end ML projects"],3:["Learn Advanced Computer Vision (CNNs, Object Detection)","Learn Advanced NLP (Transformers, HuggingFace)","Learn Reinforcement Learning basics","Learn Generative AI (GANs, Diffusion Models)","Learn Large Language Models (LLMs) & Prompt Engineering","Fine-tune pre-trained AI models","Build advanced AI applications"],4:["Learn MLOps (Model deployment & monitoring)","Learn Docker & Kubernetes for AI","Deploy models using Cloud (AWS SageMaker/GCP Vertex)","Optimize models for Edge/Mobile devices","Understand AI Ethics and Bias","Build full AI systems in production","Apply for AI engineer roles"]},
"Deep Learning Engineer":{free:"https://www.deeplearning.ai",paid:"https://www.coursera.org",1:["Learn Python and mathematics"],2:["Learn machine learning basics"],3:["Learn neural networks","Learn TensorFlow / PyTorch"],4:["Build deep learning projects","Deploy AI models"]},
"Computer Vision Engineer":{free:"https://pyimagesearch.com",paid:"https://www.udemy.com",1:["Learn Python","Learn linear algebra"],2:["Learn OpenCV","Learn image processing"],3:["Build computer vision projects","Learn deep learning"],4:["Deploy vision systems","Build strong CV portfolio"]},
"NLP Engineer":{free:"https://huggingface.co/learn",paid:"https://www.coursera.org",1:["Learn Python","Learn text processing basics"],2:["Learn NLP libraries (NLTK, spaCy)"],3:["Learn transformers and deep NLP","Build NLP applications"],4:["Deploy NLP models","Prepare NLP engineer interviews"]},
"Cyber Security Analyst":{free:"https://www.cybrary.it",paid:"https://www.udemy.com",1:["Learn networking basics","Learn Linux"],2:["Learn cybersecurity fundamentals","Learn security tools"],3:["Practice penetration testing","Work on security labs"],4:["Get cybersecurity certifications","Apply for security jobs"]},
"Ethical Hacker":{free:"https://www.hackthebox.com",paid:"https://www.udemy.com",1:["Learn networking and Linux"],2:["Learn ethical hacking basics","Practice CTF challenges"],3:["Practice penetration testing","Use Kali Linux tools"],4:["Prepare CEH / OSCP certification","Apply for ethical hacker jobs"]},
"Network Engineer":{free:"https://www.netacad.com",paid:"https://www.udemy.com",1:["Learn networking basics (OSI, TCP/IP)"],2:["Learn CCNA concepts","Practice subnetting"],3:["Work on network configurations","Learn routing protocols"],4:["Get CCNA/CCNP certifications","Apply for network jobs"]},
"Cloud Engineer":{free:"https://aws.amazon.com/training",paid:"https://www.acloudguru.com",1:["Learn Linux","Learn networking"],2:["Learn cloud fundamentals","Learn AWS / Azure basics"],3:["Work with Docker and Kubernetes"],4:["Get AWS/Azure certification","Apply for cloud engineer roles"]},
"DevOps Engineer":{free:"https://roadmap.sh/devops",paid:"https://www.udemy.com",1:["Learn Linux and Git"],2:["Learn CI/CD pipelines","Learn Docker"],3:["Learn Kubernetes","Build DevOps automation"],4:["Deploy DevOps pipelines","Apply for DevOps jobs"]},
"Site Reliability Engineer":{free:"https://sre.google/books",paid:"https://www.coursera.org",1:["Learn programming basics","Learn Linux"],2:["Learn cloud systems","Learn monitoring tools"],3:["Work with automation and scaling","Learn SLOs and SLAs"],4:["Build reliability systems","Apply for SRE jobs"]},
"Blockchain Developer":{free:"https://cryptozombies.io",paid:"https://www.udemy.com",1:["Learn programming basics","Understand blockchain concepts"],2:["Learn blockchain fundamentals","Learn Ethereum basics"],3:["Learn Solidity","Build smart contracts"],4:["Develop dApps","Apply for blockchain developer roles"]},
"AR/VR Developer":{free:"https://learn.xr.university",paid:"https://www.udemy.com",1:["Learn programming basics","Learn 3D fundamentals"],2:["Learn Unity","Build simple XR prototypes"],3:["Develop AR/VR apps","Learn spatial computing"],4:["Build immersive projects","Apply for AR/VR roles"]},
"IoT Developer":{free:"https://www.arduino.cc/en/Tutorial/HomePage",paid:"https://www.coursera.org",1:["Learn programming basics","Learn electronics basics"],2:["Learn sensors and microcontrollers (Arduino)"],3:["Build IoT projects","Learn MQTT and protocols"],4:["Develop smart IoT systems","Apply for IoT developer jobs"]},
"Embedded Systems Developer":{free:"https://www.edx.org",paid:"https://www.udemy.com",1:["Learn C programming","Learn digital electronics"],2:["Learn microcontrollers (AVR, ARM)"],3:["Work with embedded systems","Learn RTOS"],4:["Build embedded projects","Apply for embedded roles"]},
"Robotics Engineer":{free:"https://www.coursera.org/learn/robotics",paid:"https://www.udemy.com",1:["Python programming","C programming basics","Electronics fundamentals","Sensors basics","Arduino basics"],2:["Robot kinematics","Microcontrollers","Embedded systems","Motor control","Robotics mini projects"],3:["ROS (Robot Operating System)","Computer vision basics","Robot navigation","AI for robotics","Autonomous robots"],4:["Advanced robotics systems","Industrial robots","Robotics portfolio","Robot simulation","Robotics interviews"]},
"Automation Engineer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Programming basics","Logic building","Control systems basics","Electronics basics","Automation concepts"],2:["PLC basics","Industrial sensors","SCADA basics","Automation circuits","Automation labs"],3:["Industrial automation","Robotic automation","Process control","Factory automation","Automation projects"],4:["Advanced PLC systems","Industrial IoT","Automation optimization","Portfolio projects","Automation interviews"]},
"QA / Software Tester":{free:"https://www.guru99.com/software-testing.html",paid:"https://www.udemy.com",1:["Programming basics","Testing fundamentals","Software lifecycle","Manual testing basics","Bug reporting"],2:["Test case writing","Functional testing","Regression testing","Agile testing","Testing projects"],3:["Automation testing","Selenium framework","API testing","Performance testing","Automation scripts"],4:["Advanced testing tools","CI/CD testing","Test optimization","Portfolio projects","QA interviews"]},
"Manual Tester":{free:"https://www.guru99.com/software-testing.html",paid:"https://www.udemy.com",1:["Software basics","Testing concepts","Bug tracking","Test documentation","Software lifecycle"],2:["Functional testing","UI testing","Test cases writing","Defect management","Testing practice"],3:["System testing","Integration testing","Regression testing","Test management tools","Testing projects"],4:["Advanced QA methods","Quality improvement","Portfolio projects","Real testing practice","Testing interviews"]},
"Automation Tester":{free:"https://testautomationu.applitools.com",paid:"https://www.udemy.com",1:["Programming basics","Testing fundamentals","Java/Python basics","Software lifecycle","Manual testing basics"],2:["Selenium basics","Test automation frameworks","Test scripting","Automation tools","Automation projects"],3:["API testing","Performance testing","CI/CD testing","Advanced frameworks","Automation labs"],4:["Automation architecture","Test optimization","Portfolio creation","Real automation projects","Automation interviews"]},
"Database Administrator":{free:"https://www.w3schools.com/sql",paid:"https://www.udemy.com",1:["Database basics","SQL fundamentals","Data models","Table creation","Basic queries"],2:["Advanced SQL","Database design","Stored procedures","Triggers","Database security"],3:["Database optimization","Backup strategies","Replication","Performance tuning","Large database systems"],4:["Cloud databases","Database monitoring","Portfolio projects","Enterprise databases","DBA interviews"]},
"Data Engineer":{free:"https://www.kaggle.com/learn",paid:"https://www.coursera.org",1:["Python basics","SQL basics","Data fundamentals","Statistics basics","Data cleaning"],2:["ETL pipelines","Data warehouses","Big data basics","Spark fundamentals","Data processing"],3:["Distributed systems","Data pipeline design","Cloud data tools","Streaming data","Advanced data engineering"],4:["Production pipelines","Cloud deployment","Portfolio projects","Data architecture","Data engineer interviews"]},
"Big Data Engineer":{free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Programming basics","Python fundamentals","Database basics","Linux basics","Statistics basics"],2:["Hadoop ecosystem","Spark framework","Data processing","Big data tools","Data pipelines"],3:["Distributed computing","Data streaming","Cloud big data systems","Performance optimization","Big data projects"],4:["Big data architecture","Cloud data platforms","Portfolio projects","Real datasets","Big data interviews"]},
"UI Designer":{free:"https://www.figma.com/learn",paid:"https://www.udemy.com",1:["Design fundamentals","Color theory","Typography basics","UI principles","Design tools basics"],2:["Figma tool","Wireframing","Layout design","UI components","Design practice"],3:["Advanced UI systems","Responsive UI","Mobile UI design","Design systems","UI projects"],4:["Professional UI portfolio","Design optimization","Accessibility design","Real UI projects","UI interviews"]},
"UX Designer":{free:"https://www.interaction-design.org",paid:"https://www.coursera.org",1:["Design thinking","User research basics","UX fundamentals","Wireframing","UX principles"],2:["User journeys","Prototyping","Usability testing","UX tools","UX case studies"],3:["Advanced UX research","Product usability","UX optimization","UX strategy","UX projects"],4:["UX portfolio","Real product design","User testing reports","UX presentations","UX interviews"]},
"Product Designer":{free:"https://www.figma.com/learn",paid:"https://www.coursera.org",1:["Design basics","Product thinking","UI fundamentals","Sketching ideas","Design tools"],2:["Product UI design","Wireframes","User flows","Product prototypes","Design practice"],3:["Design systems","Product research","Usability testing","Product design projects","Advanced UI/UX"],4:["Product portfolio","Real product design","Design leadership","Product optimization","Product design interviews"]},
"Technical Support Engineer":{free:"https://www.netacad.com",paid:"https://www.udemy.com",1:["Computer hardware basics","Operating systems","Networking basics","Troubleshooting basics","Customer support skills"],2:["System troubleshooting","Network issues","Technical documentation","Helpdesk tools","Support labs"],3:["Advanced troubleshooting","System monitoring","Security basics","IT service management","Technical support projects"],4:["Enterprise support systems","Portfolio projects","Customer management","Advanced diagnostics","Support interviews"]},
"Customer Support Specialist":{free:"https://www.hubspot.com/academy/customer-service-training",paid:"https://www.coursera.org/browse/business/customer-support",1:["Learn communication skills","Understand customer service principles","Practice active listening","Learn basic computer skills"],2:["Learn CRM software (e.g., Zendesk, Salesforce)","Develop problem-solving skills","Handle difficult customer scenarios","Product knowledge training"],3:["Master CRM tools","Learn about ticketing systems","Practice upselling and cross-selling","Create support documentation (FAQs)"],4:["Gain industry experience","Specialize in technical or non-technical support","Build a portfolio of positive customer interactions","Apply for customer support roles"]},
"Sales Representative":{free:"https://academy.hubspot.com/courses/sales-training",paid:"https://www.coursera.org/browse/business/sales",1:["Learn communication skills","Understand sales principles","Basic product knowledge","Learn CRM basics"],2:["Practice lead generation","Master sales techniques","Develop negotiation skills","Practice sales calls"],3:["Learn advanced sales strategies","Master account management","Use sales analytics","Build client relationships"],4:["Develop sales leadership skills","Build a sales portfolio","Specialize in an industry","Prepare for sales interviews"]},
"System Administrator":{free:"https://linuxjourney.com",paid:"https://www.udemy.com",1:["Linux basics","Operating systems","Networking basics","Command line tools","System concepts"],2:["Server setup","User management","System security","Backup systems","Monitoring tools"],3:["Cloud servers","Automation scripts","System optimization","Infrastructure management","Admin projects"],4:["Enterprise system design","Disaster recovery","Portfolio projects","Cloud admin systems","Sysadmin interviews"]},
"IT Project Manager":{free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Project basics","Communication skills","Team management","Project planning","Business basics"],2:["Agile methodology","Scrum framework","Risk management","Project documentation","Project tools"],3:["Large project management","Budget management","Leadership skills","Project analytics","Team coordination"],4:["Enterprise project management","Portfolio management","Real project case studies","Management portfolio","PM interviews"]},
"Product Manager":{free:"https://www.productschool.com/blog",paid:"https://www.coursera.org",1:["Product basics","Business fundamentals","Market research","Product thinking","Communication skills"],2:["Product lifecycle","User research","Product strategy","Roadmaps","Product documentation"],3:["Product analytics","Growth strategies","Product leadership","A/B testing","Product projects"],4:["Product portfolio","Product launch strategy","Business growth","Real product cases","Product manager interviews"]},
"Business Analyst":{free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Business fundamentals","Excel basics","Data analysis basics","Communication skills","Problem solving"],2:["Business modeling","Requirements analysis","Process mapping","Data visualization","Business case studies"],3:["Advanced analytics","Business intelligence tools","Stakeholder management","Business strategy","Real analysis projects"],4:["Enterprise analysis","Portfolio creation","Business reporting","Consulting practice","BA interviews"]},
"SAP Consultant":{free:"https://open.sap.com",paid:"https://www.udemy.com",1:["Business process basics","ERP fundamentals","Database basics","SAP overview","Business systems"],2:["SAP modules basics","SAP configuration","SAP navigation","SAP projects","ERP systems"],3:["Advanced SAP modules","Business workflows","SAP integration","SAP reporting","SAP projects"],4:["SAP certification prep","Enterprise SAP systems","SAP portfolio","Consulting practice","SAP interviews"]},
"Salesforce Developer":{free:"https://trailhead.salesforce.com",paid:"https://www.udemy.com",1:["CRM basics","Programming basics","Salesforce fundamentals","Business logic","Trailhead modules"],2:["Apex programming","Lightning components","Salesforce data models","API integration","Salesforce projects"],3:["Advanced Apex","Automation tools","Salesforce architecture","Security models","Large Salesforce apps"],4:["Salesforce certifications","Enterprise apps","Portfolio projects","Consulting practice","Salesforce interviews"]},
"Digital Marketing Specialist":{free:"https://learndigital.withgoogle.com",paid:"https://www.udemy.com",1:["Marketing basics","Content creation","Social media basics","SEO basics","Online tools"],2:["Search marketing","Email marketing","Content strategy","Analytics basics","Campaign planning"],3:["Advanced SEO","Paid advertising","Conversion optimization","Marketing analytics","Campaign projects"],4:["Marketing strategy","Portfolio projects","Brand management","Growth marketing","Marketing interviews"]},
"SEO Specialist":{free:"https://moz.com/beginners-guide-to-seo",paid:"https://www.udemy.com",1:["SEO basics","Keyword research","Content basics","Search engines","Website structure"],2:["On-page SEO","Technical SEO","Link building","SEO tools","SEO audits"],3:["Advanced SEO strategies","Content marketing","SEO analytics","SEO optimization","SEO projects"],4:["SEO consulting","SEO portfolio","Growth strategies","Real SEO cases","SEO interviews"]},
"IT Consultant":{free:"https://www.edx.org",paid:"https://www.coursera.org",1:["IT fundamentals","Business basics","Communication skills","Technology overview","Problem solving"],2:["Business technology analysis","IT systems design","Consulting methods","Client communication","Project analysis"],3:["Enterprise systems","Technology strategy","Digital transformation","Consulting case studies","IT consulting projects"],4:["Consulting portfolio","Enterprise consulting","Client strategy","Technology roadmaps","Consultant interviews"]},
"Software Architect":{free:"https://www.freecodecamp.org",paid:"https://www.coursera.org",1:["Programming basics","Data structures","Algorithms basics","System fundamentals","Coding practice"],2:["Software design patterns","Architecture basics","API design","Scalable systems","Coding projects"],3:["Microservices architecture","Distributed systems","Cloud architecture","Performance optimization","Large systems"],4:["Enterprise architecture","System design interviews","Architecture portfolio","Real architecture cases","Leadership skills"]},
"AI Research Engineer":{free:"https://www.kaggle.com/learn",paid:"https://www.coursera.org",1:["Python programming","Math fundamentals","Statistics basics","Linear algebra","Data fundamentals"],2:["Machine learning algorithms","Model training","Research basics","Data preprocessing","ML experiments"],3:["Deep learning models","Research papers","AI experimentation","Advanced algorithms","Research projects"],4:["AI publications","Research portfolio","Advanced AI models","Academic research","AI research interviews"]},
"Security Engineer":{free:"https://www.cybrary.it",paid:"https://www.udemy.com",1:["Networking basics","Linux fundamentals","Cybersecurity basics","Programming basics","Security concepts"],2:["Network security","Cryptography","Security tools","Security labs","Threat detection"],3:["Penetration testing","Cloud security","Security architecture","Security monitoring","Incident response"],4:["Security certifications","Enterprise security","Portfolio projects","Advanced threat analysis","Security interviews"]},
"FinTech Developer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Programming basics","Finance fundamentals","Database basics","Web basics","Math basics"],2:["Payment systems","Financial APIs","Secure transactions","Backend development","FinTech mini projects"],3:["Blockchain basics","Trading systems","Financial data analysis","FinTech platforms","Advanced FinTech apps"],4:["FinTech product development","Security compliance","Portfolio projects","Financial platforms","FinTech interviews"]},
// ===== NEW 100 DOMAINS (SOFTWARE & HARDWARE) =====
"Golang Developer":{free:"https://go.dev/learn/",paid:"https://www.udemy.com",1:["Learn Go Syntax & Basics","CLI Application Dev","Git & Version Control"],2:["Goroutines & Concurrency","Web Frameworks (Gin/Echo)","RESTful APIs"],3:["Microservices Architecture","gRPC & Protobufs","Docker & Kubernetes"],4:["High Performance Optimization","System Design","Cloud Deployment"]},
"Rust Developer":{free:"https://www.rust-lang.org/learn",paid:"https://www.udemy.com",1:["Rust Syntax & Ownership","Cargo Package Manager","Basic CLI Tools"],2:["Memory Management","Traits & Generics","Async Programming"],3:["WebAssembly (Wasm)","Embedded Rust","Networking"],4:["System Programming","Performance Tuning","Rust Compiler Internals"]},
"Ruby on Rails Developer":{free:"https://rubyonrails.org/learn",paid:"https://www.codecademy.com",1:["Ruby Syntax","OOP in Ruby","MVC Architecture"],2:["Rails Framework","ActiveRecord","Relational DBs"],3:["API Development","Background Jobs (Sidekiq)","Testing (RSpec)"],4:["Scalable Web Apps","Metaprogramming","Gem Development"]},
"PHP Developer":{free:"https://www.php.net/manual/en/tutorial.php",paid:"https://laracasts.com",1:["PHP Syntax","HTML/CSS Integration","MySQL Basics"],2:["OOP PHP","Composer","Laravel Framework"],3:["API Integration","Security Best Practices","Unit Testing"],4:["Enterprise Apps","Design Patterns","Legacy Code Refactoring"]},
"WordPress Developer":{free:"https://wordpress.org/support/",paid:"https://www.udemy.com",1:["PHP Basics","WP Dashboard","HTML/CSS"],2:["Theme Development","Plugin Basics","WP CLI"],3:["Advanced Plugin Dev","React for WP","Headless WP"],4:["WP Core Contribution","Security Hardening","Performance Tuning"]},
"Svelte Developer":{free:"https://svelte.dev/tutorial",paid:"https://www.udemy.com",1:["JS/TS Basics","Svelte Syntax","Reactivity"],2:["SvelteKit","Component Design","State Management"],3:["SSR & SSG","API Routes","Animation & Motion"],4:["Performance Optimization","Large Scale Apps","Open Source"]},
"Vue.js Developer":{free:"https://vuejs.org/guide/introduction.html",paid:"https://www.udemy.com",1:["JS Fundamentals","Vue Directives","Template Syntax"],2:["Components & Props","Vue Router","Pinia/Vuex"],3:["Composition API","Nuxt.js","Unit Testing"],4:["Performance Tuning","Vue Internals","Enterprise UI"]},
"Angular Developer":{free:"https://angular.io/start",paid:"https://www.pluralsight.com",1:["TypeScript","Angular CLI","Components"],2:["Dependency Injection","RxJS & Observables","Routing"],3:["State Management (NgRx)","Forms & Validation","Testing"],4:["Micro-frontends","Performance Optimization","Architecture"]},
"Desktop App Developer":{free:"https://www.electronjs.org",paid:"https://www.udemy.com",1:["JS/HTML/CSS","Node.js Basics","Electron Basics"],2:["IPC Communication","Native APIs","OS Integration"],3:["Security","Performance","Auto-updates"],4:["Cross-platform Distribution","Native Modules","Code Signing"]},
"Qt C++ Developer":{free:"https://doc.qt.io",paid:"https://www.udemy.com",1:["C++ Basics","Qt Creator","Signals & Slots"],2:["Qt Widgets","QML & Quick","GUI Design"],3:["Networking","Multithreading","Database Integration"],4:["Embedded Qt","Performance Profiling","Custom Modules"]},
"Scala Developer":{free:"https://docs.scala-lang.org",paid:"https://www.coursera.org",1:["JVM Basics","Scala Syntax","Functional Programming"],2:["Akka Framework","Concurrency","Collections"],3:["Spark & Big Data","Play Framework","Microservices"],4:["Type System Mastery","Distributed Systems","Performance"]},
"Haskell Developer":{free:"http://learnyouahaskell.com",paid:"https://www.udemy.com",1:["Functional Concepts","Haskell Syntax","Types"],2:["Monads & Functors","IO Handling","Cabal/Stack"],3:["Parser Combinators","Web Frameworks (Yesod)","Testing"],4:["Type Theory","Compiler Design","Advanced FP"]},
"Elixir Developer":{free:"https://elixir-lang.org/learning.html",paid:"https://pragmaticstudio.com",1:["Erlang VM Basics","Elixir Syntax","Pattern Matching"],2:["OTP & Concurrency","Phoenix Framework","Mix Tool"],3:["LiveView","Distributed Systems","Fault Tolerance"],4:["Metaprogramming","System Architecture","Nerves (IoT)"]},
"React Native Developer":{free:"https://reactnative.dev",paid:"https://www.udemy.com",1:["React Basics","JS/TS","Flexbox"],2:["React Native CLI","Native Components","Navigation"],3:["Native Modules","Performance","State Mgmt"],4:["App Store Deploy","CI/CD for Mobile","Architecture"]},
"Flutter Developer":{free:"https://flutter.dev/learn",paid:"https://www.udemy.com",1:["Dart Language","Widget Tree","Layouts"],2:["State Management","API Integration","Animations"],3:["Native Platform Code","Firebase","Testing"],4:["Package Dev","Render Objects","App Architecture"]},
"VLSI Design Engineer":{free:"https://www.nptel.ac.in",paid:"https://www.coursera.org",1:["Digital Electronics","CMOS Basics","Verilog/VHDL"],2:["Circuit Design","Simulation Tools","FPGA Basics"],3:["Physical Design","Timing Analysis","Verification"],4:["Tapeout Process","ASIC Design","Advanced Architectures"]},
"FPGA Engineer":{free:"https://www.fpga4fun.com",paid:"https://www.udemy.com",1:["Digital Logic","VHDL/Verilog","FPGA Architecture"],2:["Vivado/Quartus","Simulation","Testbenches"],3:["DSP on FPGA","Embedded Processors","High Speed IO"],4:["System on Chip","PCIe/DDR","Timing Closure"]},
"ASIC Verification Engineer":{free:"https://verificationacademy.com",paid:"https://www.udemy.com",1:["Digital Design","Verilog","Scripting (Perl/Python)"],2:["SystemVerilog","OOP for Verification","Simulators"],3:["UVM Methodology","Coverage Driven Verification","Assertions"],4:["Formal Verification","Emulation","Tapeout Support"]},
"PCB Design Engineer":{free:"https://www.kicad.org",paid:"https://www.udemy.com",1:["Circuit Theory","Components","Schematic Capture"],2:["PCB Layout","Altium/KiCad","Signal Integrity"],3:["High Speed Design","EMI/EMC","DFM/DFA"],4:["Flex PCBs","RF Layout","Power Planes"]},
"RF Engineer":{free:"https://www.microwaves101.com",paid:"https://www.coursera.org",1:["Electromagnetics","Transmission Lines","Smith Charts"],2:["Antenna Theory","RF Components","ADS/Microwave Office"],3:["Active Circuits","LNA/PA Design","Measurement Tools"],4:["MMIC Design","5G/6G RF","System Level Design"]},
"Antenna Design Engineer":{free:"https://www.antenna-theory.com",paid:"https://www.udemy.com",1:["EM Fields","Physics","Maths"],2:["Antenna Parameters","HFSS/CST Simulation","Wire Antennas"],3:["Patch Antennas","Arrays","Impedance Matching"],4:["MIMO Systems","Phased Arrays","Fabrication"]},
"Power Electronics Engineer":{free:"https://www.coursera.org/learn/power-electronics",paid:"https://www.udemy.com",1:["Circuit Theory","Semiconductors","Power Diodes/MOSFETs"],2:["Converters (DC-DC)","Inverters","Thermal Design"],3:["Motor Drives","Control Techniques","Magnetics"],4:["Wide Bandgap Devices","Grid Integration","EV Chargers"]},
"Control Systems Engineer":{free:"https://ctms.engin.umich.edu",paid:"https://www.coursera.org",1:["Linear Algebra","Differential Eq","Signals & Systems"],2:["Feedback Control","PID Tuning","MATLAB/Simulink"],3:["State Space","Digital Control","PLC Basics"],4:["Non-linear Control","Robotics Control","Adaptive Control"]},
"Mechatronics Engineer":{free:"https://www.edx.org",paid:"https://www.udemy.com",1:["Mechanics","Electronics","Programming (C/C++)"],2:["Sensors & Actuators","Microcontrollers","CAD Design"],3:["Control Systems","Robotics","System Integration"],4:["Automation","AI in Mechatronics","Product Design"]},
"BMS Engineer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Electrochemistry","Battery Basics","C Programming"],2:["BMS Architectures","State Estimation (SOC/SOH)","Cell Balancing"],3:["Safety Standards","Thermal Mgmt","Algorithm Dev"],4:["High Voltage Systems","Automotive Standards","Testing"]},
"EV Powertrain Engineer":{free:"https://www.nptel.ac.in",paid:"https://www.udemy.com",1:["Electric Motors","Thermodynamics","Mechanics"],2:["Inverters","Drive Cycles","Vehicle Dynamics"],3:["Powertrain Sizing","Thermal Management","Simulation"],4:["System Optimization","Hybrid Systems","Testing"]},
"Automotive Embedded Engineer":{free:"https://www.udemy.com",paid:"https://www.coursera.org",1:["Embedded C","Microcontrollers","Automotive Basics"],2:["CAN/LIN Protocols","Real-Time OS","Sensors"],3:["AUTOSAR","Functional Safety (ISO 26262)","Diagnostics"],4:["ADAS Systems","V2X Communication","System Architecture"]},
"Avionics Engineer":{free:"https://www.mit.edu",paid:"https://www.coursera.org",1:["Electronics","Aerospace Basics","C/Ada"],2:["Flight Instruments","Navigation Systems","Comms"],3:["Safety Critical Systems","DO-178C","Embedded Sys"],4:["Flight Control Systems","System Integration","Certification"]},
"Signal Processing Engineer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Signals & Systems","Maths","MATLAB/Python"],2:["DSP Algorithms","Filters","Fourier Transforms"],3:["Image/Audio Processing","Real-time DSP","FPGA Implementation"],4:["Machine Learning for DSP","Radar/Sonar","Communications"]},
"Microarchitecture Engineer":{free:"https://www.nand2tetris.org",paid:"https://www.coursera.org",1:["Digital Logic","Assembly","Computer Org"],2:["Pipelining","Cache Memory","Verilog"],3:["Superscalar Arch","Branch Prediction","Multicore"],4:["SoC Design","Power Optimization","Performance Modeling"]},
"Optical Engineer":{free:"https://www.spie.org",paid:"https://www.coursera.org",1:["Physics/Optics","Geometric Optics","Maths"],2:["Lens Design","Zemax/CodeV","Lasers"],3:["Fiber Optics","Photonics","Optical Testing"],4:["Optical Systems","Non-linear Optics","Fabrication"]},
"Semiconductor Process Engineer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Solid State Physics","Chemistry","Material Science"],2:["Lithography","Etching","Deposition"],3:["Process Integration","Yield Analysis","Metrology"],4:["Advanced Nodes","FinFET/GAA","Fab Management"]},
"Analog Circuit Designer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Circuit Theory","BJT/MOSFETs","Op-Amps"],2:["Feedback","Stability","Simulation (Spice)"],3:["ADCs/DACs","PLLs","Low Power Design"],4:["Mixed Signal Design","RF Analog","Chip Layout"]},
"MLOps Engineer":{free:"https://mlops.org",paid:"https://www.coursera.org",1:["Python","Docker/Git","ML Basics"],2:["CI/CD Pipelines","Model Serving","Kubernetes"],3:["Model Monitoring","Feature Stores","Cloud ML (AWS/GCP)"],4:["Scalable ML Infra","Automated Retraining","Governance"]},
"Computer Vision Researcher":{free:"https://opencv.org",paid:"https://www.udemy.com",1:["Python/C++","Linear Algebra","Image Proc Basics"],2:["OpenCV","CNNs","Deep Learning (PyTorch)"],3:["Object Detection","Segmentation","3D Vision"],4:["SLAM","Generative Models","Real-time Systems"]},
"Prompt Engineer":{free:"https://learnprompting.org",paid:"https://www.coursera.org",1:["LLM Basics","NLP Fundamentals","Writing Skills"],2:["Prompt Techniques","Context Windows","Few-shot Learning"],3:["Chain of Thought","API Integration","Fine-tuning"],4:["AI Ethics","Model Optimization","Complex Workflows"]},
"Robotics Software Engineer":{free:"https://www.ros.org",paid:"https://www.udacity.com",1:["C++/Python","Linux","Linear Algebra"],2:["ROS/ROS2","Sensors (Lidar/Camera)","Kinematics"],3:["Path Planning","SLAM","Navigation Stack"],4:["Swarm Robotics","Manipulation","Real-time Control"]},
"Autonomous Driving Engineer":{free:"https://www.udacity.com",paid:"https://www.coursera.org",1:["C++","Computer Vision","Control Theory"],2:["Sensor Fusion","Kalman Filters","Deep Learning"],3:["Localization","Planning Algorithms","Simulation"],4:["Drive-by-wire","Safety Systems","Fleet Deployment"]},
"Quantum Software Engineer":{free:"https://qiskit.org",paid:"https://www.coursera.org",1:["Quantum Physics Basics","Linear Algebra","Python"],2:["Qiskit/Cirq","Quantum Gates","Algorithms"],3:["Error Correction","Quantum Simulation","Hybrid Algos"],4:["Quantum Hardware Interface","Research","Optimization"]},
"Bioinformatics Analyst":{free:"https://www.rosalind.info",paid:"https://www.coursera.org",1:["Biology Basics","Python/R","Statistics"],2:["Genomics","Sequence Analysis","Biopython"],3:["Data Pipelines","Machine Learning","Visualization"],4:["Cloud Computing","Structural Biology","Research"]},
"GIS Developer":{free:"https://www.esri.com",paid:"https://www.udemy.com",1:["Geography Basics","Python/JS","SQL"],2:["ArcGIS/QGIS","Spatial Analysis","GeoJSON"],3:["Web Mapping","Geospatial Databases","Remote Sensing"],4:["3D GIS","Location Intelligence","Custom Tools"]},
"Big Data Architect":{free:"https://www.edx.org",paid:"https://www.coursera.org",1:["SQL","Python/Java","Linux"],2:["Hadoop Ecosystem","Spark","NoSQL"],3:["Data Lakes","Streaming (Kafka)","Cloud Data"],4:["System Design","Governance","Cost Optimization"]},
"Business Intelligence Developer":{free:"https://www.microsoft.com/en-us/power-platform/products/power-bi",paid:"https://www.udemy.com",1:["SQL Mastery","Excel","Data Concepts"],2:["Power BI/Tableau","Data Modeling","DAX"],3:["ETL Processes","Data Warehousing","Visualization"],4:["Predictive Analytics","Enterprise Reporting","Strategy"]},
"Data Privacy Officer":{free:"https://iapp.org",paid:"https://www.coursera.org",1:["IT Basics","Legal Basics","GDPR/CCPA"],2:["Data Mapping","Risk Assessment","Compliance"],3:["Privacy by Design","Security Audits","Incident Resp"],4:["Global Regulations","Privacy Engineering","Leadership"]},
"Penetration Tester":{free:"https://www.hackthebox.com",paid:"https://www.offsec.com",1:["Networking","Linux/Windows","Scripting"],2:["Scanning Tools","Vulnerability Analysis","Web App Sec"],3:["Exploit Dev","Privilege Escalation","Active Directory"],4:["Red Teaming","Social Engineering","Reporting"]},
"SOC Analyst":{free:"https://www.cybrary.it",paid:"https://www.udemy.com",1:["Networking","OS Internals","Security Basics"],2:["SIEM Tools","Log Analysis","Incident Response"],3:["Threat Intelligence","Malware Triage","Forensics"],4:["Threat Hunting","Automation (SOAR)","Team Lead"]},
"Forensic Analyst":{free:"https://www.cisa.gov",paid:"https://www.udemy.com",1:["Computer Basics","File Systems","Law & Ethics"],2:["Forensic Tools","Disk Imaging","Evidence Handling"],3:["Memory Forensics","Mobile Forensics","Network Forensics"],4:["Expert Witness","Malware Analysis","Research"]},
"Malware Analyst":{free:"https://www.sentinelone.com",paid:"https://www.udemy.com",1:["Assembly","C/C++","OS Internals"],2:["Static Analysis","Dynamic Analysis","Debuggers"],3:["Reverse Engineering","Deobfuscation","Packers"],4:["Threat Intel","Advanced Reversing","Kernel Mode"]},
"Cryptography Engineer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Discrete Math","Number Theory","Programming"],2:["Symmetric/Asymmetric Encryption","Hashing","PKI"],3:["Crypto Protocols (TLS)","Blockchain","Side-channel"],4:["Post-Quantum Crypto","Secure MPC","Research"]},
"IAM Engineer":{free:"https://www.pingidentity.com",paid:"https://www.udemy.com",1:["Security Basics","Directory Services (AD)","Networking"],2:["SSO/MFA","SAML/OIDC","Access Control"],3:["PAM","Governance","Cloud IAM (AWS/Azure)"],4:["Zero Trust","Biometrics","Enterprise Architecture"]},
"Cloud Security Engineer":{free:"https://cloud.google.com",paid:"https://www.udemy.com",1:["Cloud Basics","Networking","Linux"],2:["AWS/Azure Security","IAM","Encryption"],3:["Compliance","Container Security","Incident Response"],4:["DevSecOps","Architecture","Auditing"]},
"5G Network Engineer":{free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Telecom Basics","Networking","Wireless Comms"],2:["LTE/5G NR","RAN Architecture","Core Network"],3:["SDN/NFV","Network Slicing","Cloud Native"],4:["6G Research","Network Optimization","Spectrum Mgmt"]},
"SDN Engineer":{free:"https://www.opennetworking.org",paid:"https://www.udemy.com",1:["Networking (CCNA)","Python","Linux"],2:["Virtualization","OpenFlow","Controllers"],3:["Network Automation","Overlay Networks","Cloud Net"],4:["NFV","Service Chaining","High Perf Networking"]},
"Cloud Architect (AWS)":{free:"https://aws.amazon.com/training",paid:"https://www.udemy.com",1:["IT Basics","Networking","AWS Core Services"],2:["VPC/EC2/S3","Security","Database Services"],3:["Serverless","Migration","Cost Optimization"],4:["Multi-cloud","Enterprise Arch","Well-Architected"]},
"Cloud Architect (Azure)":{free:"https://learn.microsoft.com",paid:"https://www.udemy.com",1:["Microsoft Ecosystem","Networking","Azure Basics"],2:["VMs/VNETs","Active Directory","Storage"],3:["App Services","Security","Hybrid Cloud"],4:["Solutions Arch","Governance","DevOps Integration"]},
"GCP Cloud Engineer":{free:"https://cloud.google.com/training",paid:"https://www.coursera.org",1:["Linux","Networking","GCP Fundamentals"],2:["Compute Engine","GKE","IAM"],3:["BigQuery","Cloud Functions","Terraform"],4:["Data Engineering","Security","Architecture"]},
"Kubernetes Administrator":{free:"https://kubernetes.io/docs",paid:"https://www.udemy.com",1:["Docker Basics","Linux","Networking"],2:["K8s Architecture","Pods/Services","Deployments"],3:["Helm","Storage/Network","Security"],4:["Service Mesh","Observability","Multi-cluster"]},
"Linux Administrator":{free:"https://linuxjourney.com",paid:"https://www.udemy.com",1:["Command Line","File Systems","Users/Groups"],2:["Bash Scripting","Process Mgmt","Networking"],3:["Systemd","LVM/Storage","Security (SELinux)"],4:["Kernel Tuning","Automation","High Availability"]},
"Windows Server Admin":{free:"https://learn.microsoft.com",paid:"https://www.udemy.com",1:["OS Basics","Hardware","Networking"],2:["Active Directory","Group Policy","DNS/DHCP"],3:["PowerShell","Hyper-V","IIS"],4:["Azure Hybrid","Security","Disaster Recovery"]},
"Storage Engineer":{free:"https://www.snia.org",paid:"https://www.udemy.com",1:["Hardware Basics","RAID","OS Basics"],2:["NAS/SAN","Fiber Channel","iSCSI"],3:["Backup/Recovery","Cloud Storage","Virtualization"],4:["Software Defined Storage","Performance","Archiving"]},
"Salesforce Administrator":{free:"https://trailhead.salesforce.com",paid:"https://www.udemy.com",1:["CRM Concepts","Salesforce Basics","Navigation"],2:["Configuration","Security","Data Mgmt"],3:["Automation (Flows)","Reports/Dashboards","App Builder"],4:["Advanced Admin","Architecture","Consulting"]},
"ServiceNow Developer":{free:"https://developer.servicenow.com",paid:"https://www.udemy.com",1:["ITSM Basics","JavaScript","ServiceNow Platform"],2:["Forms/Lists","Business Rules","Client Scripts"],3:["Workflows","Integrations (REST)","Service Portal"],4:["Custom Apps","Architecture","CMDB"]},
"Oracle ERP Consultant":{free:"https://www.oracle.com/university",paid:"https://www.udemy.com",1:["Business Processes","SQL","ERP Basics"],2:["Oracle Modules (Fin/SCM)","Configuration","Reports"],3:["Data Migration","Integrations","PL/SQL"],4:["Solution Architecture","Cloud ERP","Project Lead"]},
"SAP ABAP Developer":{free:"https://open.sap.com",paid:"https://www.udemy.com",1:["ERP Basics","Java/SQL","SAP GUI"],2:["ABAP Syntax","Dictionary","Reports"],3:["OO ABAP","Enhancements","Forms"],4:["HANA","Fiori/UI5","Integrations"]},
"SharePoint Developer":{free:"https://learn.microsoft.com",paid:"https://www.udemy.com",1:["Web Dev Basics","Microsoft 365","SharePoint UI"],2:["SPFx Framework","React","PowerShell"],3:["Power Platform","Graph API","Search"],4:["Architecture","Governance","Migration"]},
"Power Platform Developer":{free:"https://learn.microsoft.com",paid:"https://www.udemy.com",1:["Excel/Data","Power Apps Basics","Flows"],2:["Canvas Apps","Dataverse","Power Automate"],3:["Model-driven Apps","Custom Connectors","PFC"],4:["Governance","ALM","Enterprise Solutions"]},
"Technical Writer":{free:"https://developers.google.com/tech-writing",paid:"https://www.coursera.org",1:["Writing Skills","Grammar","Tech Basics"],2:["Markdown","Git","Docs-as-Code"],3:["API Documentation","DITA/XML","Content Strategy"],4:["Information Architecture","Leadership","Localization"]},
"Developer Advocate":{free:"https://devrel.net",paid:"https://www.udemy.com",1:["Coding Skills","Communication","Social Media"],2:["Content Creation","Speaking","Community Mgmt"],3:["Strategy","Metrics/Analytics","Product Feedback"],4:["DevRel Leadership","Program Mgmt","Ecosystem"]},
"Scrum Master":{free:"https://www.scrum.org",paid:"https://www.udemy.com",1:["Agile Manifesto","Scrum Basics","Team Skills"],2:["Jira/Confluence","Facilitation","Events"],3:["Coaching","Scaling (SAFe/LeSS)","Metrics"],4:["Enterprise Agile","Transformation","Leadership"]},
"Game Engine Programmer":{free:"https://www.gamedev.tv",paid:"https://www.udemy.com",1:["C++ Mastery","Maths (Linear Algebra)","Graphics Basics"],2:["OpenGL/DirectX","Memory Mgmt","Physics"],3:["Vulkan/Metal","Multithreading","Optimization"],4:["Engine Architecture","Console Dev","Tools Dev"]},
"Technical Artist":{free:"https://www.artstation.com",paid:"https://www.udemy.com",1:["3D Modeling","Scripting (Python)","Art Pipeline"],2:["Shaders (HLSL/GLSL)","Rigging","Unreal/Unity"],3:["Procedural Gen","Performance Profiling","Tools"],4:["Render Pipelines","Simulation","VFX"]},
"Gameplay Programmer":{free:"https://learn.unity.com",paid:"https://www.coursera.org",1:["C# or C++","Game Design","Unity/Unreal"],2:["Game Mechanics","UI Programming","Physics"],3:["AI for Games","Networking","Animation Systems"],4:["Multiplayer Arch","Optimization","Lead Dev"]},
"Level Designer":{free:"https://worldofleveldesign.com",paid:"https://www.udemy.com",1:["Game Design","Art Basics","Engine Tools"],2:["Layout & Pacing","Scripting","Lighting"],3:["Environmental Storytelling","Encounters","Testing"],4:["Open World Design","Lead Design","Architecture"]},
"Sound Designer":{free:"https://www.soundonsound.com",paid:"https://www.berklee.edu",1:["Audio Basics","DAW (Reaper/ProTools)","Recording"],2:["Synthesis","Foley","Game Audio (FMOD/Wwise)"],3:["Dynamic Audio","Mixing/Mastering","Scripting"],4:["Immersive Audio","Spatial Sound","Audio Director"]},
"VFX Artist":{free:"https://www.sidefx.com",paid:"https://www.udemy.com",1:["Art Fundamentals","Particles","Compositing"],2:["Houdini/Niagara","Shaders","Textures"],3:["Fluid/Smoke Sims","Destruction","Optimization"],4:["Real-time VFX","Tech Art","Supervision"]},
"AR Developer":{free:"https://lightship.dev",paid:"https://www.udemy.com",1:["C#","Unity","3D Math"],2:["ARFoundation","Vuforia","Plane Detection"],3:["Object Tracking","Cloud Anchors","UX for AR"],4:["WebAR","Smart Glasses","Spatial Computing"]},
"VR Developer":{free:"https://learn.unity.com",paid:"https://www.coursera.org",1:["C#","Unity/Unreal","VR Basics"],2:["Interaction Toolkits","Locomotion","Optimization"],3:["Multiplayer VR","Physics","Hand Tracking"],4:["Immersive Storytelling","Hardware Integ","Research"]},
"Metaverse Architect":{free:"https://ethereum.org",paid:"https://www.udemy.com",1:["3D Design","Blockchain Basics","Web3"],2:["Spatial Computing","Smart Contracts","Virtual Econ"],3:["Interoperability","Digital Identity","Standards"],4:["Virtual Worlds","Governance","System Design"]},
"Smart Contract Developer":{free:"https://cryptozombies.io",paid:"https://www.udemy.com",1:["Blockchain Theory","JS/TS","Solidity"],2:["Remix/Hardhat","Testing","Security"],3:["DeFi Protocols","Upgradability","Optimization"],4:["Auditing","Layer 2","Architecture"]},
"Blockchain Core Dev":{free:"https://bitcoin.org",paid:"https://www.coursera.org",1:["C++/Rust/Go","Cryptography","P2P Nets"],2:["Consensus Algos","EVM/WASM","Data Structures"],3:["Scalability","Sharding","Zero Knowledge"],4:["Protocol Design","Governance","Economics"]},
"NFT Developer":{free:"https://opensea.io/learn",paid:"https://www.udemy.com",1:["Web3.js","IPFS","Metadata"],2:["ERC-721/1155","Minting DApps","Marketplaces"],3:["Generative Art","Royalty Standards","Layer 2"],4:["Utility NFTs","Gaming Integration","Advanced Contracts"]},
"DeFi Architect":{free:"https://finematics.com",paid:"https://www.udemy.com",1:["Finance Basics","Smart Contracts","Tokens"],2:["AMM/DEX","Lending Protocols","Staking"],3:["Yield Farming","Flash Loans","Governance"],4:["Economic Security","Cross-chain","Innovation"]},
"RPA Developer":{free:"https://academy.uipath.com",paid:"https://www.udemy.com",1:["Logic/Flowcharts","Programming Basics","Process Analysis"],2:["UiPath/Automation Anywhere","Selectors","Recording"],3:["Orchestrator","Exception Handling","REFramework"],4:["Cognitive RPA","AI Integration","Center of Excellence"]},
"QA Automation Engineer":{free:"https://testautomationu.applitools.com",paid:"https://www.udemy.com",1:["Coding (Java/Py)","Testing Basics","Selenium"],2:["TestNG/JUnit","API Testing","Page Object Model"],3:["CI/CD Integration","Appium (Mobile)","Docker"],4:["Framework Arch","Performance Testing","Leadership"]},
"3D Printing Engineer":{free:"https://all3dp.com",paid:"https://www.coursera.org",1:["CAD Design","Materials Science","Slicing"],2:["FDM/SLA Tech","Post-processing","Troubleshooting"],3:["DFAM (Design for AM)","Industrial Printers","Metal printing"],4:["Bioprinting","Materials Dev","Manufacturing Lead"]},
"Prompt Engineering Specialist":{free:"https://learnprompting.org",paid:"https://www.coursera.org",1:["LLM Basics","NLP Fundamentals","Writing Skills"],2:["Prompt Techniques","Context Windows","Few-shot Learning"],3:["Chain of Thought","API Integration","Fine-tuning"],4:["AI Ethics","Model Optimization","Complex Workflows"]},
"Agile Coach":{free:"https://www.agilealliance.org",paid:"https://www.udemy.com",1:["Agile Manifesto","Scrum/Kanban","Facilitation"],2:["Coaching Skills","Team Dynamics","Conflict Res"],3:["Scaling Frameworks","Transformation","Mentoring"],4:["Enterprise Agile","Org Culture","Thought Leadership"]},
  "Tech Recruiter":{free:"https://www.linkedin.com/learning",paid:"https://www.coursera.org",1:["HR Basics","Tech Terminology","Sourcing"],2:["Screening","Interviewing","Tools (LinkedIn)"],3:["Talent Pipeline","Employer Branding","Metrics"],4:["Recruitment Strategy","Leadership","Global Hiring"]},

  // ===== NEW HARDWARE & SOFTWARE DOMAINS =====
  "Drone Systems Engineer": {free:"https://www.edx.org",paid:"https://www.udemy.com",1:["Aerodynamics Basics", "Python/C++", "Sensors"],2:["Flight Controllers", "ROS", "Motor Calibration"],3:["Autonomous Navigation", "Computer Vision", "Telemetry"],4:["Swarm Robotics", "Commercial Drone Deployment", "Certification"]},
  "Medical Device Engineer": {free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Biology Basics", "Circuit Design", "C Programming"],2:["Biomedical Sensors", "Microcontrollers", "Signal Processing"],3:["ISO 13485 (Safety)", "Embedded Systems", "Prototyping"],4:["Clinical Trials", "FDA Regulations", "System Integration"]},
  "Cloud Native Developer": {free:"https://www.cncf.io",paid:"https://www.udacity.com",1:["Go/Rust basics", "Docker", "Linux"],2:["Kubernetes", "Microservices", "CI/CD"],3:["Service Mesh (Istio)", "Observability", "Helm"],4:["Serverless", "Distributed Systems", "Cloud Architecture"]},
  "Web3 Developer": {free:"https://ethereum.org",paid:"https://www.udemy.com",1:["Blockchain Basics", "Cryptography", "JavaScript"],2:["Solidity", "Smart Contracts", "Hardhat/Foundry"],3:["DeFi Protocols", "DApps", "Ethers.js"],4:["Smart Contract Auditing", "Layer 2 Solutions", "Tokenomics"]},
  "Acoustic Engineer": {free:"https://ocw.mit.edu",paid:"https://www.coursera.org",1:["Physics of Sound", "Mathematics", "MATLAB"],2:["Signal Processing", "Transducer Design", "Simulation Tools"],3:["Noise Control", "Architectural Acoustics", "Audio Programming"],4:["Psychoacoustics", "Product Sound Design", "Innovation"]},
  "Embedded Linux Engineer": {free:"https://bootlin.com",paid:"https://www.udemy.com",1:["C Programming", "Linux Command Line", "OS Concepts"],2:["Kernel Compilation", "Device Trees", "Cross-Compiling"],3:["Yocto Project", "U-Boot", "Writing Device Drivers"],4:["Real-Time Linux", "System Optimization", "IoT Security"]},
  "Data Privacy Engineer": {free:"https://iapp.org",paid:"https://www.udacity.com",1:["Cybersecurity Basics", "Legal Frameworks (GDPR)", "Networking"],2:["Data Masking", "Anonymization", "Cryptography"],3:["Privacy by Design", "Threat Modeling", "Access Controls"],4:["Enterprise Privacy Arch", "Compliance Auditing", "Leadership"]},
  "Game Server Programmer": {free:"https://www.gamedev.tv",paid:"https://www.udemy.com",1:["C++/C#", "Networking Basics", "Multiplayer Concepts"],2:["UDP/TCP Protocols", "State Synchronization", "Sockets"],3:["Latency Compensation", "Database Scaling", "Cloud Hosting"],4:["MMO Architecture", "Anti-Cheat Systems", "Load Balancing"]},

  // ===== BATCH 2: 20 NEW HARDWARE & SOFTWARE DOMAINS =====
  "Platform Engineer": {free:"https://roadmap.sh/platform-engineering",paid:"https://www.udemy.com",1:["Linux & Networking", "Docker & Containers", "GitOps"],2:["Kubernetes", "Infrastructure as Code (Terraform)", "CI/CD"],3:["Internal Developer Portals", "Observability", "Service Mesh"],4:["Platform Architecture", "FinOps", "Developer Experience (DevEx)"]},
  "GraphQL Developer": {free:"https://graphql.org/learn/",paid:"https://www.apollographql.com",1:["REST vs GraphQL", "Schema Definition", "Queries & Mutations"],2:["Apollo Server/Client", "Resolvers", "Error Handling"],3:["Caching & Subscriptions", "Performance Optimization", "Security"],4:["Federation", "Microservices Integration", "Enterprise APIs"]},
  "Graph Database Engineer": {free:"https://neo4j.com/graphacademy/",paid:"https://www.udemy.com",1:["Database Basics", "Graph Theory", "Cypher Query Language"],2:["Neo4j Configuration", "Data Modeling", "Indexes"],3:["Graph Algorithms", "Performance Tuning", "Clustering"],4:["Knowledge Graphs", "Enterprise Graph Architecture", "AI Integration"]},
  "FinOps Engineer": {free:"https://www.finops.org/",paid:"https://www.coursera.org",1:["Cloud Basics (AWS/Azure)", "Billing Dashboards", "Cost Allocation"],2:["Tagging Strategies", "Right-sizing", "Spot Instances"],3:["Forecasting & Budgeting", "Automation", "FinOps Framework"],4:["Unit Economics", "Enterprise Cost Architecture", "Culture Shift"]},
  "DevSecOps Architect": {free:"https://www.cybrary.it/",paid:"https://www.udacity.com",1:["DevOps Basics", "Security Fundamentals", "Linux"],2:["SAST & DAST", "CI/CD Integration", "Container Security"],3:["Threat Modeling", "Infrastructure Security", "Compliance as Code"],4:["Enterprise Sec Architecture", "Zero Trust", "Leadership"]},
  "Low-Code/No-Code Developer": {free:"https://learn.microsoft.com",paid:"https://www.udemy.com",1:["Logic Building", "Database Basics", "Power Apps / Bubble"],2:["Automated Workflows", "API Integration", "UI/UX Basics"],3:["Custom Connectors", "Dataverse", "Governance"],4:["Enterprise Architecture", "Citizen Developer Enablement", "Center of Excellence"]},
  "Edge Computing Engineer": {free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Networking", "IoT Basics", "Linux"],2:["Micro-datacenters", "Docker", "MQTT"],3:["5G Edge Integration", "Edge Security", "Local Processing AI"],4:["Distributed Edge Architectures", "Latency Optimization", "Hardware Integration"]},
  "Distributed Systems Engineer": {free:"https://ocw.mit.edu",paid:"https://www.educative.io",1:["OS Internals", "Networking", "Concurrency"],2:["CAP Theorem", "Consensus Algorithms", "RPC & gRPC"],3:["Message Queues (Kafka)", "Data Partitioning", "Fault Tolerance"],4:["System Design at Scale", "Database Internals", "Chaos Engineering"]},
  "WebAssembly Developer": {free:"https://webassembly.org/",paid:"https://www.udemy.com",1:["JavaScript Basics", "C/C++/Rust Basics", "Browser APIs"],2:["Compiling to Wasm", "Memory Management", "DOM Interaction"],3:["Wasm in Node.js", "Performance Profiling", "WASI (Wasm System Interface)"],4:["Advanced Porting", "Custom Runtimes", "Edge Computing with Wasm"]},
  "Mainframe Developer": {free:"https://www.ibm.com/z/resources/zxplore",paid:"https://www.coursera.org",1:["Computing Basics", "Z/OS Introduction", "TSO/ISPF"],2:["COBOL Programming", "JCL (Job Control Language)", "DB2"],3:["CICS", "Modernization", "API Integration"],4:["Systems Programming", "Enterprise Migration", "Mainframe Security"]},
  "Silicon Photonics Engineer": {free:"https://ocw.mit.edu",paid:"https://www.coursera.org",1:["Optics Basics", "Semiconductor Physics", "Electromagnetics"],2:["Waveguides", "Modulators & Detectors", "Lumerical/COMSOL"],3:["Photonic Integrated Circuits", "Packaging", "Testing"],4:["Co-packaged Optics", "Quantum Photonics", "Tapeout Management"]},
  "Radar Systems Engineer": {free:"https://www.radartutorial.eu/",paid:"https://www.udemy.com",1:["Electromagnetics", "Signal Processing", "MATLAB"],2:["Radar Equation", "Antenna Arrays", "Doppler Effect"],3:["Synthetic Aperture Radar (SAR)", "Tracking Algorithms", "FMCW Radar"],4:["Electronic Warfare Systems", "Automotive Radar", "System Architecture"]},
  "SoC Integration Engineer": {free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Digital Logic", "Computer Architecture", "Verilog/SystemVerilog"],2:["IP Cores", "Bus Protocols (AMBA/AXI)", "Clock Domain Crossing"],3:["Power Domains", "System Level Simulation", "Linting"],4:["Top-Level Synthesis", "Timing Closure", "Tapeout Support"]},
  "Power Integrity Engineer": {free:"https://www.ansys.com",paid:"https://www.udemy.com",1:["Circuit Theory", "Electromagnetics", "PCB Basics"],2:["DC/AC Drop Analysis", "Decoupling Capacitors", "SIwave/HyperLynx"],3:["PDN Impedance", "Transient Analysis", "Thermal Co-simulation"],4:["Advanced Packaging", "Die-level Power Integrity", "Methodology"]},
  "Signal Integrity Engineer": {free:"https://www.signalintegrityjournal.com/",paid:"https://www.udemy.com",1:["Transmission Lines", "Electromagnetics", "S-Parameters"],2:["Crosstalk", "Jitter Analysis", "IBIS Models"],3:["High-Speed Serial Links", "DDR Memory Interfaces", "3D EM Simulation"],4:["112G/224G SerDes", "Advanced Equalization", "System Validation"]},
  "Satellite Communications Engineer": {free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Wireless Comms", "Orbital Mechanics Basics", "Physics"],2:["Link Budgets", "Modulation Schemes", "Antenna Theory"],3:["Payload Design", "Earth Station Architecture", "Frequency Coordination"],4:["Deep Space Comms", "Constellation Networks", "System Level Design"]},
  "Automotive Functional Safety Eng": {free:"https://www.nptel.ac.in",paid:"https://www.udemy.com",1:["Automotive Basics", "Systems Engineering", "Embedded C"],2:["ISO 26262 Basics", "HARA (Hazard Analysis)", "FMEA/FTA"],3:["Safety Goals", "Hardware Metrics (FMEDA)", "Software Safety"],4:["Autonomous Driving Safety", "SOTIF", "Safety Auditing"]},
  "LiDAR Systems Engineer": {free:"https://www.spie.org",paid:"https://www.coursera.org",1:["Optics & Lasers", "Physics", "Python/C++"],2:["Time of Flight", "Point Clouds", "Optomechanics"],3:["Signal Processing", "Sensor Fusion", "Solid-State LiDAR"],4:["Automotive Integration", "Perception Algorithms", "System Calibration"]},
  "NAND Flash Memory Engineer": {free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Semiconductor Physics", "Digital Circuits", "C Programming"],2:["Floating Gate / Charge Trap", "Read/Write/Erase Ops", "ECC Basics"],3:["3D NAND Architecture", "Wear Leveling", "Controller Algorithms"],4:["Next-Gen Memory (MRAM/ReRAM)", "Yield Improvement", "Storage Architecture"]},
  "Wearable Technology Engineer": {free:"https://www.hackster.io",paid:"https://www.udemy.com",1:["Electronics Basics", "Microcontrollers", "Sensors (IMU/PPG)"],2:["Bluetooth Low Energy (BLE)", "PCB Design", "Battery Management"],3:["Flex Circuits", "Embedded Firmware", "Biometric Algorithms"],4:["Form Factor Optimization", "Medical Certification", "Manufacturing"]},

  // ===== BATCH 3: 20 NEW HARDWARE & SOFTWARE DOMAINS =====
  "Backend Platform Engineer": {free:"https://roadmap.sh/backend",paid:"https://www.udemy.com",1:["API Design", "Networking Basics", "Linux"],2:["Microservices", "Docker", "Database Optimization"],3:["Kubernetes", "Message Queues", "Caching"],4:["System Design at Scale", "Observability", "Platform Architecture"]},
  "Web Performance Engineer": {free:"https://web.dev/learn/performance",paid:"https://www.coursera.org",1:["HTML/CSS/JS Basics", "Browser DevTools", "Network Tab"],2:["Core Web Vitals", "Lighthouse", "Asset Optimization"],3:["JS Execution Optimization", "Rendering Pipeline", "Caching Strategies"],4:["Advanced Profiling", "Edge Computing", "Performance Culture"]},
  "Cloud Database Administrator": {free:"https://aws.amazon.com/training",paid:"https://www.udemy.com",1:["SQL Fundamentals", "Relational DBs", "Linux Basics"],2:["NoSQL DBs", "Database Backup/Restore", "Data Modeling"],3:["Cloud DBs (RDS, DynamoDB)", "High Availability", "Performance Tuning"],4:["Multi-Region Deployments", "Database Security", "Migration Strategies"]},
  "MLOps Architect": {free:"https://ml-ops.org/",paid:"https://www.udacity.com",1:["Python", "Git", "ML Fundamentals"],2:["Docker", "CI/CD for ML", "Model Serving"],3:["Kubernetes", "Feature Stores", "Model Monitoring"],4:["Enterprise MLOps Strategy", "Governance", "Automated Retraining"]},
  "GenAI App Developer": {free:"https://learn.deeplearning.ai/",paid:"https://www.coursera.org",1:["Python", "API Basics", "Prompt Engineering"],2:["LangChain/LlamaIndex", "Vector Databases", "Embeddings"],3:["Fine-tuning Models", "RAG Architecture", "Evaluation"],4:["Production GenAI", "Cost Optimization", "AI Ethics"]},
  "Distributed Storage Engineer": {free:"https://www.snia.org/",paid:"https://www.coursera.org",1:["OS Internals", "Networking", "Data Structures"],2:["File Systems", "Block vs Object Storage", "Replication"],3:["Consensus Algorithms (Raft/Paxos)", "Erasure Coding", "Distributed Hash Tables"],4:["Ceph/GlusterFS Internals", "Exabyte Scale Storage", "Performance Tuning"]},
  "Real-Time Systems Engineer": {free:"https://ocw.mit.edu",paid:"https://www.udemy.com",1:["C/C++", "OS Fundamentals", "Concurrency"],2:["RTOS Basics", "Task Scheduling", "Interrupt Handling"],3:["Deterministic Communication", "Memory Management", "Debugging"],4:["Safety-Critical Systems", "Hard Real-Time Arch", "System Verification"]},
  "Search Engine Developer": {free:"https://lucene.apache.org/",paid:"https://www.coursera.org",1:["Data Structures", "Algorithms", "Information Retrieval Basics"],2:["Elasticsearch/Solr", "Inverted Indexes", "Text Processing"],3:["Ranking Algorithms", "Vector Search", "Distributed Search"],4:["Personalization", "Query Intent Understanding", "Scale & Latency"]},
  "AR/VR UX Designer": {free:"https://learn.unity.com",paid:"https://www.udemy.com",1:["UX Principles", "3D Space Concepts", "Sketching"],2:["Prototyping in Unity/Unreal", "Spatial Audio", "Interaction Design"],3:["User Testing in VR", "Haptics", "Accessibility in XR"],4:["Immersive Storytelling", "Enterprise XR Guidelines", "Lead Design"]},
  "IAM Architect": {free:"https://www.identityautomation.com/",paid:"https://www.udacity.com",1:["Security Basics", "Active Directory", "Authentication Protocols"],2:["OAuth2.0 / OIDC", "SAML", "Role-Based Access Control"],3:["Zero Trust Architecture", "Privileged Access Management", "Cloud IAM"],4:["Enterprise Identity Strategy", "Compliance", "Federated Identity"]},
  "Analog Layout Engineer": {free:"https://www.coursera.org",paid:"https://www.udemy.com",1:["Basic Electronics", "CMOS Theory", "Device Physics"],2:["Virtuoso/Laker Basics", "DRC/LVS Verification", "Parasitic Extraction"],3:["Matching Techniques", "Shielding", "High-Frequency Layout"],4:["Advanced Node FinFET Layout", "Floorplanning", "Tapeout Signoff"]},
  "CPU Verification Engineer": {free:"https://verificationacademy.com/",paid:"https://www.udemy.com",1:["Digital Logic", "Computer Architecture", "Verilog/SystemVerilog"],2:["UVM Basics", "Testbench Architecture", "Assembly Language"],3:["Constrained Random Testing", "Coverage Metrics", "Assertion Based Verification"],4:["Formal Verification", "Post-Silicon Debug", "Microarchitecture Verification"]},
  "RF Systems Architect": {free:"https://www.microwaves101.com/",paid:"https://www.coursera.org",1:["Electromagnetics", "Signals and Systems", "Circuit Theory"],2:["RF Transceiver Design", "Link Budgets", "Antenna Basics"],3:["Mixers & Oscillators", "Phase Noise Analysis", "ADS Simulation"],4:["5G/6G System Architecture", "MmWave Design", "Phased Array Systems"]},
  "Telecommunications Network Engineer": {free:"https://www.cisco.com/",paid:"https://www.coursera.org",1:["Networking Fundamentals", "TCP/IP", "Linux"],2:["Routing & Switching", "VoIP", "Fiber Optics Basics"],3:["BGP/OSPF", "MPLS", "Network Security"],4:["SDN/NFV", "Core Network Architecture", "Carrier-Grade Reliability"]},
  "MEMS Engineer": {free:"https://ocw.mit.edu",paid:"https://www.udemy.com",1:["Physics", "Material Science", "Mechanics of Materials"],2:["Microfabrication Basics", "Sensors and Actuators", "CAD for MEMS"],3:["FEA Simulation (COMSOL)", "Etching & Deposition", "Packaging"],4:["Commercialization", "Bio-MEMS", "Advanced Transducer Design"]},
  "Biomedical Instrumentation Engineer": {free:"https://www.edx.org",paid:"https://www.coursera.org",1:["Biology & Anatomy", "Electronics Basics", "Sensors"],2:["Signal Conditioning", "Op-Amps", "Data Acquisition"],3:["Medical Imaging Basics", "ECG/EEG Design", "Microcontrollers"],4:["ISO 13485 Compliance", "Clinical Validation", "Implantable Devices"]},
  "Optical Communications Engineer": {free:"https://www.spie.org/",paid:"https://www.coursera.org",1:["Optics Fundamentals", "Electromagnetics", "Physics"],2:["Fiber Optic Theory", "Lasers & Modulators", "Photodetectors"],3:["DWDM Systems", "Optical Amplifiers", "Link Design"],4:["Coherent Communications", "Silicon Photonics Integration", "Subsea Networks"]},
  "Quantum Computing Hardware Engineer": {free:"https://qiskit.org/",paid:"https://www.edx.org",1:["Quantum Mechanics", "Linear Algebra", "Cryogenics Basics"],2:["Superconducting Qubits/Trapped Ions", "Microwave Engineering", "Control Electronics"],3:["Decoherence Mitigation", "Dilution Refrigerators", "Quantum Gates"],4:["Scaling Qubit Architectures", "Error Correction Hardware", "Fabrication"]},
  "ASIC Physical Design Engineer": {free:"https://www.vlsi-expert.com/",paid:"https://www.udemy.com",1:["Digital Logic", "CMOS Basics", "Verilog"],2:["Synthesis", "Floorplanning", "Placement & Routing"],3:["Clock Tree Synthesis", "Static Timing Analysis (STA)", "Power Analysis"],4:["Signoff (DRC/LVS/IR Drop)", "Advanced Tech Nodes", "Yield Optimization"]},
  "Automotive Diagnostics Engineer": {free:"https://www.vector.com/",paid:"https://www.udemy.com",1:["Automotive Basics", "Electrical Systems", "C Programming"],2:["CAN/LIN/FlexRay protocols", "UDS (Unified Diagnostic Services)", "OBD-II"],3:["Diagnostic Tools (CANoe)", "Flash Bootloaders", "Fault Memory Management"],4:["Over-The-Air (OTA) Updates", "Advanced Driver Assistance (ADAS) Diagnostics", "System Arch"]}
};

// ===== AUTO-NORMALIZER: Ensure exactly 5 lessons per year for ALL 192 domains =====
function normalizeToFive(items, domain, year) {
  if (!Array.isArray(items)) return items;
  if (items.length === 5) return items;
  
  // Object-based items formatting (i.e. Full Stack)
  if (items.length > 0 && typeof items[0] === 'object') {
    if (items.length > 5) return items.slice(0, 5);
    let result = [...items];
    while (result.length < 5) {
      result.push({
        title: `Advanced ${domain} Concepts (Part ${result.length + 1})`,
        domain: items[0].domain,
        desc: `Explore deeper concepts, optimizations, and best practices for Year ${year}.`,
        tools: items[0].tools || [],
        outcome: "Mastery of advanced techniques"
      });
    }
    return result;
  }

  // String-based items formatting (intelligent distribution)
  let result = [];
  if (items.length === 1) result = [`Introduction to ${items[0]}`, `Core concepts of ${items[0]}`, `Advanced techniques in ${items[0]}`, `Practical application and labs`, `Real-world project and review`];
  else if (items.length === 2) result = [`Basics of ${items[0]}`, `Advanced ${items[0]}`, `Basics of ${items[1]}`, `Advanced ${items[1]}`, `Capstone integration project`];
  else if (items.length === 3) result = [items[0], items[1], items[2], `Advanced concepts & optimization`, `Build a real-world portfolio project`];
  else if (items.length === 4) result = [items[0], items[1], items[2], items[3], `Capstone project and review`];
  else if (items.length === 6) result = [items[0], items[1], items[2], items[3], `${items[4]} & ${items[5]}`];
  else if (items.length >= 7) result = [items[0], items[1], items[2], `${items[3]} & ${items[4]}`, `${items.slice(5).join(" & ")}`];
  else result = items; // fallback
  return result;
}
Object.keys(roadmaps).forEach(d => { [1, 2, 3, 4].forEach(y => { if (roadmaps[d][y]) roadmaps[d][y] = normalizeToFive(roadmaps[d][y], d, y); }); });

const domainList = document.getElementById("domainList");
// Sort domains alphabetically for easier searching
Object.keys(roadmaps).sort().forEach(d => {
  let option=document.createElement("option");
  option.value=d;
  domainList.appendChild(option);
});

const domainColors={
  "Frontend":"#00e5ff","Backend":"#00ffb3","Database":"#ffd600",
  "Cloud":"#00aaff","DevOps":"#ff3366","AI Tools":"#bf5af2","Projects":"#ff9500"
};
const domainIcons={
  "Frontend":"fa-solid fa-laptop-code",
  "Backend":"fa-solid fa-server",
  "Database":"fa-solid fa-database",
  "Cloud":"fa-brands fa-aws",
  "DevOps":"fa-solid fa-gears",
  "AI Tools":"fa-solid fa-robot",
  "Projects":"fa-solid fa-rocket"
};
const yearLabels=["Beginner","Intermediate","Advanced","Industry-Level"];

function getProgress(domain, year){
  const key=`progress_${domain}_${year}`;
  return JSON.parse(localStorage.getItem(key)||'[]');
}
function saveProgress(domain, year, checked){
  localStorage.setItem(`progress_${domain}_${year}`, JSON.stringify(checked));
}

const weeklyPlans = {
    // === WEB DEVELOPER - YEAR 1 ===
    "Learn Internet Basics & Version Control": [
        "Week 1: Understand IP addresses, packets, HTTP/HTTPS, and the request/response cycle.",
        "Week 2: Learn how DNS works and explore web hosting types (shared, VPS).",
        "Week 3: Install Git, configure it, and learn core commands (init, add, commit).",
        "Week 4: Work with remote repositories on GitHub (clone, push, pull, branch)."
    ],
    "Master HTML5 Semantics & Accessibility": [
        "Week 1: Master basic HTML tags, document structure, and common attributes.",
        "Week 2: Learn semantic HTML5 tags (<header>, <nav>, <main>, <article>).",
        "Week 3: Understand web accessibility (WCAG), ARIA roles, and accessible forms.",
        "Week 4: Build a complex, semantically structured, and accessible web page."
    ],
    "Master CSS3 Basics, Flexbox, & Grid": [
        "Week 1: Learn CSS selectors, properties, the box model, and colors.",
        "Week 2: Deep dive into Flexbox for creating one-dimensional layouts.",
        "Week 3: Master CSS Grid for complex two-dimensional responsive designs.",
        "Week 4: Recreate a complex website layout using Flexbox and Grid."
    ],
    "Learn JavaScript Basics & DOM Manipulation": [
        "Week 1: Learn JS data types, variables, operators, and control flow.",
        "Week 2: Understand functions, parameters, return values, and scope.",
        "Week 3: Learn DOM selection (querySelector) and modify elements/styles.",
        "Week 4: Master JS Events and build an interactive to-do list."
    ],
    "Build 3 Simple Static Websites": [
        "Week 1: Project 1: A personal tribute page using semantic HTML and CSS.",
        "Week 2: Project 2: A technical documentation page with sidebar navigation.",
        "Week 3: Project 3: A product landing page with a responsive feature section.",
        "Week 4: Refactor and deploy all three projects to GitHub Pages."
    ],
    // === WEB DEVELOPER - YEAR 2 ===
    "Advanced JavaScript (ES6+, Async/Await)": [
        "Week 1: Learn ES6 arrow functions, destructuring, and spread/rest operators.",
        "Week 2: Understand the event loop, callbacks, and asynchronous JS.",
        "Week 3: Master Promises (.then, .catch, Promise.all) for async operations.",
        "Week 4: Learn async/await syntax to write cleaner asynchronous code."
    ],
    "Learn a CSS Framework (Tailwind/Bootstrap)": [
        "Week 1: Understand CSS frameworks and set up a Tailwind CSS project.",
        "Week 2: Learn utility-first workflow and build responsive components.",
        "Week 3: Explore advanced Tailwind features (custom config, dark mode).",
        "Week 4: Rebuild a static website from scratch using Tailwind CSS."
    ],
    "Master React.js Basics & Hooks": [
        "Week 1: Understand JSX and create your first functional components.",
        "Week 2: Learn about props to pass data and render dynamic lists.",
        "Week 3: Master the useState hook to manage component-level state.",
        "Week 4: Deep dive into the useEffect hook for handling side effects."
    ],
    "Understand REST APIs & Data Fetching": [
        "Week 1: Understand RESTful principles and how to interact with APIs.",
        "Week 2: Use the Fetch API to retrieve data from a public endpoint.",
        "Week 3: Handle loading states, errors, and conditional rendering in React.",
        "Week 4: Implement React Router to build a multi-page single-page app (SPA)."
    ],
    "Build Responsive Dynamic Web Projects": [
        "Week 1: Plan and design a dynamic app like a movie database browser.",
        "Week 2: Build the core UI components and configure routing.",
        "Week 3: Integrate with a free public API to fetch and display data.",
        "Week 4: Add features like search/filtering and deploy to Vercel/Netlify."
    ],
    // === WEB DEVELOPER - YEAR 3 ===
    "Learn Node.js & Express.js Fundamentals": [
        "Week 1: Intro to Node.js, the event loop, and built-in modules.",
        "Week 2: Set up an Express.js server, routing, and handle requests.",
        "Week 3: Learn middleware and implement custom logging functions.",
        "Week 4: Build a basic REST API with GET, POST, PUT, DELETE endpoints."
    ],
    "Master Relational & NoSQL Databases": [
        "Week 1: Database theory, SQL DDL/DML, and PostgreSQL basics.",
        "Week 2: Practice complex SQL queries (JOINs, GROUP BY, aggregations).",
        "Week 3: Intro to NoSQL, document-based DBs, and set up MongoDB Atlas.",
        "Week 4: Learn basic CRUD operations in MongoDB and schema design."
    ],
    "Understand RESTful APIs & Authentication": [
        "Week 1: Deep dive into API design, status codes, and use Postman.",
        "Week 2: Connect your Express API to a database (PostgreSQL/MongoDB).",
        "Week 3: Understand auth vs authorization; hash passwords with bcrypt.",
        "Week 4: Implement JSON Web Tokens (JWT) and protect routes."
    ],
    "Implement CRUD Operations Securely": [
        "Week 1: Build robust Create and Read endpoints for your resources.",
        "Week 2: Build Update and Delete routes with proper access control.",
        "Week 3: Add input data validation (e.g., using Joi or Express-validator).",
        "Week 4: Implement global error handling and secure HTTP headers."
    ],
    "Build a Full-Stack Web Application": [
        "Week 1: Plan a full-stack project (e.g., a simple blog or dashboard).",
        "Week 2: Build the complete backend API with Node.js and your DB.",
        "Week 3: Build the React frontend, including forms and data displays.",
        "Week 4: Connect frontend to backend, handle state, and deploy."
    ],
    // === WEB DEVELOPER - YEAR 4 ===
    "Learn TypeScript & Next.js": [
        "Week 1: Intro to TypeScript static typing, interfaces, and types.",
        "Week 2: Advanced TS features (generics, enums) and converting JS projects.",
        "Week 3: Intro to Next.js file-based routing, SSR, and SSG.",
        "Week 4: Build a Next.js application fetching data with server-side functions."
    ],
    "Learn Docker & Containerization": [
        "Week 1: What is Docker? Write your first Dockerfile for a Node app.",
        "Week 2: Learn Docker commands, port mapping, and volumes.",
        "Week 3: Create a multi-container app using docker-compose.",
        "Week 4: Push Docker images to a registry and understand best practices."
    ],
    "Deploy on Cloud & CI/CD Pipelines": [
        "Week 1: Deploy a Next.js app to Vercel and a Node API to Render/Heroku.",
        "Week 2: Intro to AWS (EC2/S3) and manual deployments on Linux instances.",
        "Week 3: Understand Continuous Integration and Continuous Deployment (CI/CD).",
        "Week 4: Create a GitHub Actions workflow to automate tests and deployments."
    ],
    "Understand System Design & Microservices": [
        "Week 1: System design fundamentals: scalability, load balancing, CDNs.",
        "Week 2: Monolith vs. Microservices and communication patterns (REST/gRPC).",
        "Week 3: Asynchronous messaging (message queues like RabbitMQ).",
        "Week 4: Design scalable systems and practice architecture interviews."
    ],
    "Build a Large-Scale Production Project": [
        "Week 1: Plan a complex architecture (e.g., an e-commerce or real-time chat app).",
        "Week 2: Implement microservices/backend logic and containerize them.",
        "Week 3: Build a feature-rich frontend and integrate complex state management.",
        "Week 4: Set up CI/CD, deploy to the cloud, and implement monitoring."
    ]
};

function getSubProgress(domain, year, total){
  const key=`progress_sub_${domain}_${year}`;
  let saved = JSON.parse(localStorage.getItem(key));
  if (!saved || saved.length !== total) {
    // Backward compatibility: if main tasks were already checked, reflect that in sub-tasks
    const mainChecked = getProgress(domain, year);
    saved = Array.from({length: total}, (_, i) => {
      const isDone = mainChecked[i] === true;
      return [isDone, isDone, isDone, isDone];
    });
    saveSubProgress(domain, year, saved);
  }
  return saved;
}
function saveSubProgress(domain, year, subChecked){
  localStorage.setItem(`progress_sub_${domain}_${year}`, JSON.stringify(subChecked));
}

function generateMonthWisePlan(title, color, domain, year, idx, subCheckedItem) {
  let weeks;
  
  // Extract title correctly if an object was passed
  const taskTitle = typeof title === 'object' ? title.title : title;
  
  // Check for a specific, detailed plan first
  if (weeklyPlans[taskTitle]) {
      weeks = weeklyPlans[taskTitle];
  } else {
      // Advanced Dynamic Weekly Planner for all domains
      const lowerTitle = taskTitle.toLowerCase();
      
      // Extract the core subject from the task title
      let subject = taskTitle.replace(/^(Learn |Master |Understand |Build |Develop |Participate in |Create |Advanced |Work with |Work on |Get |Practice |Deploy |Publish |Apply for |Prepare for |Analyse |Use |Write |Implement )/i, '').trim();
      if (!subject) subject = taskTitle; // Fallback

      // Categorize task to generate accurate linear roadmap
      if (lowerTitle.includes("build") || lowerTitle.includes("create") || lowerTitle.includes("develop") || lowerTitle.includes("project")) {
          weeks = [
            `Planning & Architecture. Define the scope, requirements, wireframes, and tech stack for ${subject}.`,
            `Core Implementation. Write the foundational code, set up the database/environment, and build main features.`,
            `Refinement & Advanced Features. Add polish, handle edge cases, improve UI/UX, and optimize performance.`,
            `Testing & Deployment. Perform thorough testing, fix critical bugs, and deploy the project to production.`
          ];
      } else if (lowerTitle.includes("deploy") || lowerTitle.includes("publish") || lowerTitle.includes("cloud")) {
          weeks = [
            `Environment Setup. Prepare the production environment, configure servers, and manage environment variables.`,
            `CI/CD & Automation. Set up pipelines (e.g., GitHub Actions) for automated testing and building.`,
            `Deployment & Migration. Safely deploy the application, configure domain/SSL, and migrate any necessary data.`,
            `Monitoring & Maintenance. Set up logging, monitor application health, and plan for scaling.`
          ];
      } else if (lowerTitle.includes("prepare") || lowerTitle.includes("apply") || lowerTitle.includes("interview") || lowerTitle.includes("portfolio")) {
          weeks = [
            `Resume & Portfolio. Update your resume, optimize your LinkedIn profile, and polish your portfolio projects.`,
            `Core Concepts Review. Deeply review fundamental concepts, data structures, algorithms, and system design.`,
            `Mock Interviews. Practice common technical and behavioral interview questions. Do peer mock interviews.`,
            `Application Strategy. Start applying to target companies, attend networking events, and follow up.`
          ];
      } else if (lowerTitle.includes("test") || lowerTitle.includes("qa") || lowerTitle.includes("verify") || lowerTitle.includes("bug")) {
          weeks = [
            `Test Planning. Understand requirements, identify test scenarios, and write comprehensive test cases for ${subject}.`,
            `Manual & Functional Testing. Execute test cases, identify edge cases, and report bugs effectively.`,
            `Automation Setup. Write automated test scripts (unit/integration/E2E) for the identified core flows.`,
            `CI/CD Integration. Integrate automated tests into the deployment pipeline and analyze coverage reports.`
          ];
      } else if (lowerTitle.includes("database") || lowerTitle.includes("sql") || lowerTitle.includes("data ")) {
          weeks = [
            `Data Modeling & Fundamentals. Understand schema design, data types, and basic querying for ${subject}.`,
            `Advanced Operations. Master complex queries, aggregations, joins, or indexing strategies.`,
            `Performance & Optimization. Analyze query performance, implement caching, and optimize data retrieval.`,
            `Integration. Connect the database/data pipeline to an application and perform real-world CRUD operations.`
          ];
      } else {
          // Default learning pattern
          weeks = [
            `Introduction & Fundamentals. Learn the basic theory, syntax, and environment setup for ${subject}.`,
            `Core Concepts & Practice. Deep dive into the main features, APIs, and complete hands-on exercises.`,
            `Advanced Topics. Explore complex patterns, best practices, and edge cases related to ${subject}.`,
            `Mini-Project Integration. Consolidate your knowledge by building a small real-world module utilizing ${subject}.`
          ];
      }
  }
  let html = `<div class="subtask-list">`;
  for(let i=0; i<4; i++){
    const isDone = subCheckedItem[i] ? 'checked' : '';
    html += `
      <div class="subtask-item" style="border-left-color: ${color}; align-items: flex-start;">
        <input type="checkbox" class="item-checkbox sub-checkbox" id="subcheck-${year}-${idx}-${i}" ${isDone}
          onchange="toggleSubItem('${domain}', ${year}, ${idx}, ${i}, this)" onclick="event.stopPropagation()">
        <div>
          <div class="subtask-month" style="display:inline-block;">Week ${i+1}</div>
          <div class="subtask-desc" style="margin-top:6px;">${weeks[i]}</div>
        </div>
      </div>`;
  }
  html += `</div>`;
  return html;
}

function generateRoadmap(){
  const domain = document.getElementById("domain").value;
  if (!domain || !roadmaps[domain]) {
    document.getElementById("roadmapOutput").innerHTML = `<p style="color:var(--red);">Please search and select a valid domain.</p>`;
    const timeIndicator = document.getElementById("time-indicator");
    if (timeIndicator) timeIndicator.style.display = 'none';
    return;
  }
  const year = parseInt(document.getElementById("year").value);
  const startYear = year === 0 ? 1 : year;
  const endYear = 4; // Always output up to year 4 so users see the job application phase

  trackActivity('Roadmap Generated', `Viewed roadmap for ${domain}`);

  // ===== DYNAMIC TIME INDICATOR LOGIC =====
  const yearsToComplete = endYear - startYear + 1;
  const timeText = yearsToComplete > 1 ? `${yearsToComplete} years` : `1 year`;
  const timeIndicator = document.getElementById("time-indicator");
  if (timeIndicator) {
    timeIndicator.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> &nbsp; Estimated Time to Complete: <strong>${timeText}</strong>`;
    timeIndicator.style.display = 'block';
  }
  // ========================================

  let output=`<div class="domain-label"><i class="fa-solid fa-map"></i> &nbsp;${domain}</div>`;

  if(roadmaps[domain].free || roadmaps[domain].paid){
    output+=`<div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 24px;">`;
    if(roadmaps[domain].free) output+=`<a href="${roadmaps[domain].free}" target="_blank" class="btn btn-green" style="text-decoration:none;"><i class="fa-solid fa-graduation-cap"></i> &nbsp;Free Platform</a>`;
    if(roadmaps[domain].paid) output+=`<a href="${roadmaps[domain].paid}" target="_blank" class="btn btn-blue" style="text-decoration:none;"><i class="fa-solid fa-credit-card"></i> &nbsp;Paid Platform</a>`;
    output+=`</div>`;
  }

  for(let y=startYear; y<=endYear; y++){
    const items=roadmaps[domain][y];
    const total=Array.isArray(items)?items.length:0;
    const checked=getProgress(domain,y);
    if(checked.length<total) saveProgress(domain, y, Array(total).fill(false)); // pad array
    const subChecked=getSubProgress(domain,y,total);
    
    let doneSub = 0;
    subChecked.forEach(arr => doneSub += arr.filter(Boolean).length);
    const totalSub = total * 4;
    const pct = totalSub > 0 ? Math.round((doneSub/totalSub)*100) : 0;

    output+=`
    <div class="year-header">
      <div class="year-title">
        <i class="fa-solid fa-calendar-days" style="color:var(--blue);"></i>
        Year ${y}
        <span class="year-badge">${yearLabels[y-1]}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="year-progress-label" id="pct-label-${y}">${pct}%</span>
        <span id="done-label-${y}" style="font-size:11px;color:var(--muted);">${doneSub}/${totalSub} weeks done</span>
      </div>
    </div>
    <div class="year-progress-wrap">
      <div class="year-progress-bar" id="prog-${y}" style="width:${pct}%"></div>
    </div>
    <div id="cards-year-${y}">`;

    if(Array.isArray(items)){
      items.forEach((item,i)=>{
        if(typeof item==='object'){
          const color=domainColors[item.domain]||"#00aaff";
          const icon=domainIcons[item.domain]||"fa-solid fa-circle";
          const isDone=checked[i]||false;
          output+=`
          <div class="roadmap-card ${isDone?'completed':''}" id="card-${y}-${i}" style="border-left:4px solid ${color};" onclick="toggleSubtasks('sub-${y}-${i}')">
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <input type="checkbox" class="item-checkbox" id="check-${y}-${i}" ${isDone?'checked':''}
                onchange="toggleItem('${domain}',${y},${i},this)" onclick="event.stopPropagation()">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <span class="domain-badge" style="background:${color}22;color:${color};border:1px solid ${color}44;">
                      <i class="${icon}"></i> ${item.domain}
                    </span>
                    <strong class="card-title" style="font-size:15px;color:var(--text);font-weight:600;">${i+1}. ${item.title}</strong>
                  </div>
                  <i class="fa-solid fa-chevron-down expand-icon" id="icon-sub-${y}-${i}" style="color:var(--muted); font-size: 12px; transition: 0.3s;"></i>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);margin:0 0 12px;line-height:1.6;">${item.desc}</p>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                  ${item.tools.map(t=>`<span class="tool-chip"><i class="fa-solid fa-wrench" style="font-size:9px;"></i> ${t}</span>`).join('')}
                </div>
                <div style="font-size:12px;color:${color};display:flex;align-items:center;gap:6px;">
                  <i class="fa-solid fa-circle-check"></i> ${item.outcome}
                </div>
                
                <!-- Subtasks Container (Month-wise) -->
                <div id="sub-${y}-${i}" class="subtasks-container" onclick="event.stopPropagation()">
                  <div style="font-size: 12px; font-weight: 600; color: ${color}; margin-bottom: 12px; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px;">
                    <i class="fa-regular fa-calendar-check"></i> 1-Month Detail Plan
                  </div>
                  ${generateMonthWisePlan(item.title, color, domain, y, i, subChecked[i])}
                </div>
              </div>
            </div>
          </div>`;
        } else {
          const isDone=checked[i]||false;
          output+=`
          <div class="roadmap-card ${isDone?'completed':''}" id="card-${y}-${i}" style="border-left:4px solid var(--green);" onclick="toggleSubtasks('sub-${y}-${i}')">
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <input type="checkbox" class="item-checkbox" id="check-${y}-${i}" ${isDone?'checked':''}
                onchange="toggleItem('${domain}',${y},${i},this)" onclick="event.stopPropagation()">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="card-title" style="font-size:14px; font-weight: 500;">${item}</span>
                  <i class="fa-solid fa-chevron-down expand-icon" id="icon-sub-${y}-${i}" style="color:var(--muted); font-size: 12px; transition: 0.3s;"></i>
                </div>
                <!-- Subtasks Container (Month-wise) -->
                <div id="sub-${y}-${i}" class="subtasks-container" onclick="event.stopPropagation()">
                  <div style="font-size: 12px; font-weight: 600; color: var(--green); margin-bottom: 12px; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px;">
                    <i class="fa-regular fa-calendar-check"></i> 1-Month Detail Plan
                  </div>
                  ${generateMonthWisePlan(item, 'var(--green)', domain, y, i, subChecked[i])}
                </div>
              </div>
            </div>
          </div>`;
        }
      });
    }
    output+=`</div>`;
  }
  document.getElementById("roadmapOutput").innerHTML = output;
}

function toggleSubtasks(id) {
  const container = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  if (container.classList.contains('active')) {
    container.classList.remove('active');
    if(icon) icon.style.transform = 'rotate(0deg)';
  } else {
    container.classList.add('active');
    if(icon) icon.style.transform = 'rotate(180deg)';
  }
}

function toggleItem(domain, year, idx, el){
  const items=roadmaps[domain][year];
  const total=Array.isArray(items)?items.length:0;
  
  // Update Main Progress
  let checked=getProgress(domain,year);
  if(checked.length<total) checked=Array(total).fill(false);
  checked[idx]=el.checked;
  saveProgress(domain,year,checked);
  
  const card=document.getElementById(`card-${year}-${idx}`);
  if(card) card.classList.toggle('completed',el.checked);
  
  // Track Activity
  const taskName = typeof roadmaps[domain][year][idx] === 'object' ? roadmaps[domain][year][idx].title : roadmaps[domain][year][idx];
  if (el.checked) trackActivity('Task Completed', `Checked main task in ${domain}: ${taskName}`);

  // Sync Sub-tasks (4 weeks) when main task is toggled
  let subChecked = getSubProgress(domain, year, total);
  subChecked[idx] = [el.checked, el.checked, el.checked, el.checked];
  saveSubProgress(domain, year, subChecked);
  
  // Visually update the UI checkboxes
  for(let i=0; i<4; i++) {
    let subBox = document.getElementById(`subcheck-${year}-${idx}-${i}`);
    if(subBox) subBox.checked = el.checked;
  }
  
  updateProgressBar(domain, year, total, subChecked);
}

function toggleSubItem(domain, year, idx, subIdx, el) {
  const items = roadmaps[domain][year];
  const total = Array.isArray(items) ? items.length : 0;
  let subChecked = getSubProgress(domain, year, total);
  
  subChecked[idx][subIdx] = el.checked;
  saveSubProgress(domain, year, subChecked);
  
  // Track Activity
  if (el.checked) trackActivity('Sub-Task Completed', `Checked Week ${subIdx+1} for ${domain}`);

  // Auto-check main task if all 4 weeks are completed
  const allSubDone = subChecked[idx].every(Boolean);
  const mainCheck = document.getElementById(`check-${year}-${idx}`);
  if (mainCheck && mainCheck.checked !== allSubDone) {
    mainCheck.checked = allSubDone;
    toggleItem(domain, year, idx, mainCheck);
  } else {
    updateProgressBar(domain, year, total, subChecked);
  }
}

function updateProgressBar(domain, year, total, subChecked) {
  let doneSub = 0;
  subChecked.forEach(arr => doneSub += arr.filter(Boolean).length);
  const totalSub = total * 4;
  const pct = totalSub > 0 ? Math.round((doneSub/totalSub)*100) : 0;
  
  const bar=document.getElementById(`prog-${year}`);
  if(bar) bar.style.width=pct+'%';
  const lbl=document.getElementById(`pct-label-${year}`);
  if(lbl) lbl.textContent=pct+'%';
  const sub=document.getElementById(`done-label-${year}`);
  if(sub) sub.textContent=`${doneSub}/${totalSub} weeks done`;
}

function downloadRoadmap(type = 'pdf') {
  const domain = document.getElementById("domain").value;
  if (!roadmaps[domain]) {
    alert("Please select a domain to download.");
    return;
  }

  const yearVal = parseInt(document.getElementById("year").value);
  const startYear = yearVal === 0 ? 1 : yearVal;
  const endYear = 4;

  if (type === 'word') {
    let content = `<html><head><meta charset='utf-8'><title>${domain} - Career Roadmap</title></head><body style="font-family: Arial, sans-serif;">`;
    content += `<h1 style="color: #0055aa;">${domain} - Career Roadmap</h1>`;
    if (roadmaps[domain].free || roadmaps[domain].paid) {
      content += `<h3>Recommended Resources:</h3><ul>`;
      if (roadmaps[domain].free) content += `<li>Free: <a href="${roadmaps[domain].free}">${roadmaps[domain].free}</a></li>`;
      if (roadmaps[domain].paid) content += `<li>Paid: <a href="${roadmaps[domain].paid}">${roadmaps[domain].paid}</a></li>`;
      content += `</ul><hr/>`;
    }
    for (let y = startYear; y <= endYear; y++) {
      if (!roadmaps[domain][y]) continue;
      content += `<h2 style="color: #0055aa;">Year ${y}</h2>`;
      const items = roadmaps[domain][y];
      if (Array.isArray(items)) {
        content += `<ol>`;
        items.forEach((item, idx) => {
          if (typeof item === 'string') {
            content += `<li style="margin-bottom: 8px;">${item}</li>`;
          } else {
            content += `<li style="margin-bottom: 12px;"><strong>${item.title} [${item.domain}]</strong><br/>${item.desc}`;
            if (item.tools) content += `<br/><em>Tools: ${item.tools.join(", ")}</em>`;
            content += `</li>`;
          }
        });
        content += `</ol>`;
      }
    }
    content += `</body></html>`;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain.replace(/\s+/g, '_')}_Roadmap.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let yPos = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const maxWidth = 180;

  function addText(txt, fontSize = 10, isBold = false, indent = 0) {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(txt, maxWidth - indent);
    lines.forEach(line => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin + indent, yPos);
      yPos += (fontSize * 0.4) + 2; 
    });
  }

  addText(`${domain} - Career Roadmap`, 16, true);
  yPos += 5;

  if (roadmaps[domain].free || roadmaps[domain].paid) {
    addText("Recommended Resources:", 12, true);
    if (roadmaps[domain].free) addText(`Free: ${roadmaps[domain].free}`, 10, false, 5);
    if (roadmaps[domain].paid) addText(`Paid: ${roadmaps[domain].paid}`, 10, false, 5);
    yPos += 10;
  }

  for (let y = startYear; y <= endYear; y++) {
    if (!roadmaps[domain][y]) continue;
    if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }

    addText(`Year ${y}`, 14, true);
    addText("--------------------------------------------------", 10, false);
    yPos += 5;

    const items = roadmaps[domain][y];
    if (Array.isArray(items)) {
      items.forEach((item, idx) => {
        if (typeof item === 'string') {
          addText(`${idx + 1}. ${item}`, 11, false, 5);
          yPos += 3;
        } else {
          addText(`${idx + 1}. ${item.title} [${item.domain}]`, 11, true, 5);
          addText(item.desc, 10, false, 10);
          if (item.tools) addText(`Tools: ${item.tools.join(", ")}`, 10, false, 10);
          yPos += 5;
        }
      });
    }
    yPos += 10;
  }

  doc.save(`${domain}-Roadmap.pdf`);
}

const questions=[
  {q:"Do you enjoy coding websites?",domain:"Web Developer"},
  {q:"Do you enjoy frontend work?",domain:"Frontend Developer"},
  {q:"Do you enjoy backend systems?",domain:"Backend Developer"},
  {q:"Do you enjoy full stack projects?",domain:"Full Stack Developer"},
  {q:"Do you like Android apps?",domain:"Mobile App Developer (Android)"},
  {q:"Do you like iOS apps?",domain:"Mobile App Developer (iOS)"},
  {q:"Do you enjoy AI/ML?",domain:"Artificial Intelligence Engineer"},
  {q:"Do you enjoy data analysis?",domain:"Data Analyst"},
  {q:"Do you enjoy security tasks?",domain:"Cyber Security Analyst"},
  {q:"Do you enjoy helping customers solve problems?", domain: "Customer Support Specialist"},
  {q:"Do you enjoy persuading people and closing deals?", domain: "Sales Representative"},
  {q:"Do you like game development?",domain:"Game Developer"},
  {q:"Are you fascinated by drones, flight mechanics, and control systems?", domain:"Drone Systems Engineer"},
  {q:"Do you want to build life-saving technology for hospitals and healthcare?", domain:"Medical Device Engineer"},
  {q:"Do you enjoy working with cloud infrastructure like Kubernetes and Docker?", domain:"Cloud Native Developer"},
  {q:"Are you interested in blockchain, crypto, and decentralized apps?", domain:"Web3 Developer"},
  {q:"Does working with sound, audio signals, and acoustics interest you?", domain:"Acoustic Engineer"},
  {q:"Do you like working close to the hardware with Linux operating systems?", domain:"Embedded Linux Engineer"},
  {q:"Are you passionate about protecting user data and GDPR compliance?", domain:"Data Privacy Engineer"},
  {q:"Do you want to build massive multiplayer backends for video games?", domain:"Game Server Programmer"},
  {q:"Do you want to build and maintain internal developer platforms to make software teams faster?", domain: "Platform Engineer"},
  {q:"Are you interested in building flexible APIs using query languages like GraphQL?", domain: "GraphQL Developer"},
  {q:"Do you enjoy working with highly connected data models using Neo4j or similar databases?", domain: "Graph Database Engineer"},
  {q:"Do you like analyzing cloud costs and optimizing cloud infrastructure spending?", domain: "FinOps Engineer"},
  {q:"Are you passionate about integrating security checks directly into the CI/CD pipeline?", domain: "DevSecOps Architect"},
  {q:"Do you want to build applications rapidly using visual drag-and-drop platforms?", domain: "Low-Code/No-Code Developer"},
  {q:"Are you fascinated by processing data at the edge of the network, closer to IoT devices?", domain: "Edge Computing Engineer"},
  {q:"Do you enjoy designing complex systems that scale across thousands of servers?", domain: "Distributed Systems Engineer"},
  {q:"Are you excited about compiling high-performance code to run natively in the browser?", domain: "WebAssembly Developer"},
  {q:"Are you interested in maintaining and modernizing enterprise mainframe computing systems?", domain: "Mainframe Developer"},
  {q:"Do you want to work on optical data transmission directly on silicon chips?", domain: "Silicon Photonics Engineer"},
  {q:"Are you interested in designing radar systems for defense, aerospace, or automotive use?", domain: "Radar Systems Engineer"},
  {q:"Do you like integrating various IP cores into a single System on Chip (SoC)?", domain: "SoC Integration Engineer"},
  {q:"Are you focused on ensuring stable power delivery across complex circuit boards?", domain: "Power Integrity Engineer"},
  {q:"Do you enjoy analyzing and mitigating high-speed signal issues like crosstalk and jitter?", domain: "Signal Integrity Engineer"},
  {q:"Are you fascinated by satellite communication protocols and space payloads?", domain: "Satellite Communications Engineer"},
  {q:"Do you want to ensure the critical functional safety (ISO 26262) of modern vehicles?", domain: "Automotive Functional Safety Eng"},
  {q:"Are you interested in developing laser-based LiDAR mapping and sensing systems?", domain: "LiDAR Systems Engineer"},
  {q:"Do you want to work on the semiconductor physics behind modern solid-state memory?", domain: "NAND Flash Memory Engineer"},
  {q:"Are you excited about designing the electronics inside smartwatches and health trackers?", domain: "Wearable Technology Engineer"},
  {q:"Do you enjoy designing the foundational APIs and microservices for large platforms?", domain: "Backend Platform Engineer"},
  {q:"Are you obsessed with making websites load lightning-fast and optimizing core web vitals?", domain: "Web Performance Engineer"},
  {q:"Do you want to manage, optimize, and secure massive databases in the cloud?", domain: "Cloud Database Administrator"},
  {q:"Are you interested in automating and scaling the deployment of machine learning models?", domain: "MLOps Architect"},
  {q:"Do you want to build applications using Large Language Models and vector databases?", domain: "GenAI App Developer"},
  {q:"Are you fascinated by how data is stored, replicated, and retrieved across thousands of servers?", domain: "Distributed Storage Engineer"},
  {q:"Do you enjoy working on systems where timing and deterministic execution are critical?", domain: "Real-Time Systems Engineer"},
  {q:"Do you want to build algorithms that index and retrieve information at blazing speeds?", domain: "Search Engine Developer"},
  {q:"Are you passionate about designing immersive user experiences for Virtual and Augmented Reality?", domain: "AR/VR UX Designer"},
  {q:"Do you enjoy designing systems that control user identities and secure enterprise access?", domain: "IAM Architect"},
  {q:"Are you interested in manually drawing the complex silicon layouts for analog microchips?", domain: "Analog Layout Engineer"},
  {q:"Do you enjoy finding bugs and verifying the complex logic inside computer processors (CPUs)?", domain: "CPU Verification Engineer"},
  {q:"Are you fascinated by high-frequency radio waves, transceivers, and wireless link design?", domain: "RF Systems Architect"},
  {q:"Do you want to design and maintain the massive networks that power global telecommunications?", domain: "Telecommunications Network Engineer"},
  {q:"Are you interested in designing microscopic mechanical sensors and actuators (MEMS)?", domain: "MEMS Engineer"},
  {q:"Do you want to design electronic medical devices like ECGs and imaging systems for healthcare?", domain: "Biomedical Instrumentation Engineer"},
  {q:"Are you fascinated by transmitting massive amounts of data using light and fiber optics?", domain: "Optical Communications Engineer"},
  {q:"Do you want to build the physical quantum processors and cryogenic systems of the future?", domain: "Quantum Computing Hardware Engineer"},
  {q:"Do you enjoy the challenge of placing and routing billions of transistors on a single microchip?", domain: "ASIC Physical Design Engineer"},
  {q:"Are you interested in developing the fault diagnostic systems for modern smart vehicles?", domain: "Automotive Diagnostics Engineer"}
];

let index=0;
let score={};
Object.keys(roadmaps).forEach(d=>score[d]=0);
let radarChartInstance = null;

function startTest(){
  index=0;
  Object.keys(roadmaps).forEach(d=>score[d]=0);
  localStorage.removeItem('careerTestState');
  trackActivity('Career Test Started', 'Began aptitude assessment');
  showQuestion();
}

function showQuestion(){
  if(index>=questions.length){showResult();return;}
  let q=questions[index];
  let progress = Math.round((index/questions.length)*100);
  document.getElementById("questionBox").innerHTML=`
    <div class="anim-slide">
    <div class="test-header">
      <div class="q-meta"><i class="fa-solid fa-list-check"></i> QUESTION ${index+1} OF ${questions.length}</div>
      <div class="q-domain-hint">${q.domain} Area</div>
    </div>
    <div class="progress-wrap" style="margin-bottom: 25px;"><div class="progress-bar" style="width:${progress}%"></div></div>
    <h2 class="q-text" style="font-size: 20px; margin-bottom: 30px; font-weight: 500; line-height: 1.5; color: var(--text);">${q.q}</h2>
    <div class="likert-scale">
      <button class="likert-btn sd" onclick="answer(0)"><span>1</span> Strongly Disagree</button>
      <button class="likert-btn d" onclick="answer(1)"><span>2</span> Disagree</button>
      <button class="likert-btn n" onclick="answer(2)"><span>3</span> Neutral</button>
      <button class="likert-btn a" onclick="answer(3)"><span>4</span> Agree</button>
      <button class="likert-btn sa" onclick="answer(4)"><span>5</span> Strongly Agree</button>
    </div>
    <div style="margin-top: 25px; font-size: 12px; color: var(--muted);">
      <i class="fa-solid fa-circle-info"></i> Select the option that best describes your interest.
    </div>
    </div>`;
}

function answer(val){
  score[questions[index].domain] += val;
  index++; 
  localStorage.setItem('careerTestState', JSON.stringify({ index: index, score: score }));
  showQuestion();
}

function showResult(){
  // Calculate max possible points dynamically
  let maxScores = {};
  questions.forEach(q => { maxScores[q.domain] = (maxScores[q.domain] || 0) + 4; });

  // Convert scores to percentages and sort
  let results = Object.keys(score)
    .filter(d => maxScores[d] > 0)
    .map(d => ({ domain: d, pct: Math.round((score[d] / maxScores[d]) * 100) }))
    .filter(r => r.pct >= 10) // Show all matches 10% and above
    .sort((a,b) => b.pct - a.pct);

  trackActivity('Career Test Completed', `Top match: ${results.length > 0 ? results[0].domain : 'None'}`);

  let resultHTML = `
    <div class="anim-slide">
    <div class="q-meta" style="margin-bottom: 15px;"><i class="fa-solid fa-chart-pie"></i> ASSESSMENT COMPLETE</div>
    <h2 style="font-size: 26px; color: var(--text); margin-bottom: 10px; font-family: 'Orbitron', monospace;">Your Career Matches</h2>
    <p style="color:var(--muted);font-size:15px; margin-bottom: 25px; max-width: 600px;">Based on your unique profile, here are the technical paths that best align with your interests. Click on any domain to view its detailed roadmap.</p>
    
    <div class="chart-wrap" style="height: 320px; width: 100%; max-width: 500px; margin: 0 auto 30px;">
      <canvas id="resultRadarChart"></canvas>
    </div>
    <div class="result-cards">`;

  if (results.length === 0) {
    resultHTML += `<p style="color: var(--orange); padding: 20px;">No strong matches found. Try retaking the assessment!</p>`;
  } else {
    results.forEach((res, i) => {
      let color = "var(--text-secondary)";
      if(res.pct >= 80) color = "var(--green)";
      else if(res.pct >= 60) color = "var(--blue)";
      else if(res.pct >= 40) color = "var(--cyan)";
      else if(res.pct >= 20) color = "var(--orange)";

    resultHTML += `
      <div class="result-card" style="border-left: 4px solid ${color};">
        <div class="res-rank">#${i+1}</div>
        <div class="res-info">
          <div class="res-domain">${res.domain}</div>
          <div class="res-bar-wrap"><div class="res-bar" style="width: ${res.pct}%; background: ${color};"></div></div>
        </div>
        <div class="res-pct" style="color: ${color};">${res.pct}% Match</div>
        <button class="btn btn-outline res-view-btn" style="border-color: ${color} !important; color: ${color};" 
          onclick="document.getElementById('domain').value='${res.domain}'; showSection('roadmap'); generateRoadmap();">
          <i class="fa-solid fa-map-location-dot"></i> View
        </button>
      </div>`;
  });
  }

  resultHTML += `
    </div>
    <div style="margin-top: 35px; display: flex; justify-content: center;">
      <button class="btn btn-outline" onclick="resetTest()"><i class="fa-solid fa-rotate-right"></i> Retake Assessment</button>
    </div>
    </div>`;

  document.getElementById("questionBox").innerHTML = resultHTML;

  // Render Radar Chart
  if (results.length > 0) {
    if (radarChartInstance) {
      radarChartInstance.destroy(); // Clear existing chart on retakes
    }
    const ctxRadar = document.getElementById("resultRadarChart").getContext("2d");
    const topResults = results.slice(0, 6); // Limit to top 6 points for readability

    radarChartInstance = new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: topResults.map(r => r.domain.length > 15 ? r.domain.substring(0, 15) + '...' : r.domain),
        datasets: [{
          label: 'Match %',
          data: topResults.map(r => r.pct),
          backgroundColor: 'rgba(0, 229, 255, 0.2)',
          borderColor: 'rgba(0, 229, 255, 0.8)',
          pointBackgroundColor: '#00ffb3', // var(--green)
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00ffb3',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: { color: '#c8dff5', font: { family: 'Inter', size: 10 } },
            ticks: { display: false, min: 0, max: 100, stepSize: 20 }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return `Match: ${context.raw}%`; }
            }
          }
        }
      }
    });
  }
}

function resetTest() {
  index = 0;
  Object.keys(roadmaps).forEach(d=>score[d]=0);
  localStorage.removeItem('careerTestState');
  document.getElementById("questionBox").innerHTML = `
    <div class="anim-slide">
    <div style="font-size: 48px; color: var(--blue); margin-bottom: 10px;"><i class="fa-solid fa-clipboard-user"></i></div>
    <h2 style="font-size: 24px; margin-bottom: 15px; color: var(--text);">Professional Career Profiler</h2>
    <p style="color:var(--muted);font-size:16px; margin-bottom: 30px; max-width: 500px;">Evaluate your interests, work style, and technical inclinations. This assessment uses a weighted scoring algorithm to match you with your optimal tech domains.</p>
    <button class="btn btn-blue" onclick="startTest()"><i class="fa-solid fa-play"></i> Begin Assessment</button>
    </div>
  `;
}

let chatHistory = [];

// Add your specific Questions and Answers here
const predefinedQA = {
  "what is careerforge ai": "CareerForge AI is your **smart career mentor platform** providing roadmaps, tests, and AI-driven guidance.",
  "what are the best it jobs in the future": "The best IT jobs in the future include **Artificial Intelligence Engineer**, **Data Scientist**, **Cyber Security Analyst**, **Cloud Engineer**, and **Full Stack Developer**.",
  "which programming language is best for beginners": "**Python** is one of the best programming languages for beginners because it is easy to learn and widely used in AI, data science, and web development.",
  "how can a student prepare for an it job": "A student can prepare for an IT job by **learning programming languages**, **practicing coding problems**, **building projects**, and **improving communication skills**.",
  "is web development a good career choice": "Yes, **web development** is a good career because many companies need websites and web applications.",
  "what skills are required for a software developer": "A software developer needs **programming skills**, **logical thinking**, **problem-solving ability**, **knowledge of algorithms**, and **teamwork skills**.",
  "what does a data scientist do": "A **Data Scientist** analyzes large amounts of data and uses **machine learning** and **statistics** to help companies make decisions.",
  "what is cyber security": "**Cyber Security** is the practice of protecting computers, networks, and data from cyber attacks and hackers.",
  "can electrical engineering students get it jobs": "Yes, **electrical engineering students** can enter IT jobs by learning programming, software development, and other technical skills.",
  "what is full stack development": "**Full Stack Development** means developing both the front-end and back-end parts of a web application.",
  "how can students get a high paying job in it": "Students can get a high paying job in IT by **learning advanced skills**, **building strong projects**, and **practicing coding regularly**.",
  "hi": "Hello",
  "hello": "Hi there",
  "how are you": "I am fine",
  "what is your name": "I am a simple chatbot",
  "who created you": "I was created using C language",
  "what is c": "C is a programming language",
  "what is programming": "Programming is giving instructions to computer",
  "what is computer": "Computer is an electronic machine",
  "good morning": "Good morning",
  "good afternoon": "Good afternoon",
  "good evening": "Good evening",
  "good night": "Good night",
  "what can you do": "I can chat with you",
  "are you human": "No I am a program",
  "do you sleep": "No I do not sleep",
  "do you eat": "No I do not eat",
  "tell me a joke": "Why C programmers love coffee",
  "haha": "I am glad you are happy",
  "thank you": "You are welcome",
  "thanks": "Welcome",
  "sorry": "No problem",
  "help": "Just type simple sentences",
  "what is your age": "I do not have age",
  "where do you live": "I live inside this program",
  "are you real": "I am virtual",
  "do you like me": "Yes I like chatting",
  "what is 1+1": "2",
  "what is 2+2": "4",
  "what is india": "India is a country",
  "what is college": "College is a place to study",
  "what is student": "Student is a learner",
  "what is teacher": "Teacher teaches students",
  "do you know me": "I know what you type",
  "can you learn": "No I am very simple",
  "bye": "Goodbye"
};

const chatSuggestions = [
  "What are the best IT jobs in the future?",
  "Which programming language is best for beginners?",
  "How can a student prepare for an IT job?",
  "Is web development a good career choice?"
];

function initChatSuggestions() {
  const chatbox = document.getElementById("chatbox");
  let html = `<div id="welcome-chat" style="text-align:center; margin:auto; color:#666;">
    <p style="margin-bottom:15px; font-weight:bold;">Try asking one of these:</p>
    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">`;
  
  chatSuggestions.forEach(s => {
    html += `<button onclick="askSuggestion('${s}')" style="background:white; border:1px solid #34b7f1; color:#34b7f1; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:13px; font-family:inherit;">${s}</button>`;
  });
  
  html += `</div></div>`;
  chatbox.innerHTML = html;
}

function askSuggestion(text) {
  document.getElementById("mentorInput").value = text;
  mentor();
}

async function mentor(customQuery = null) {
  const input = document.getElementById("mentorInput");
  const query = customQuery || input.value.trim();
  if (!query) return;

  const chatbox = document.getElementById("chatbox");
  if (document.getElementById("welcome-chat")) chatbox.innerHTML = "";

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // 1. Show User Message
  chatbox.innerHTML += `
    <div class="cmsg user" style="display:flex; justify-content:flex-end; margin:10px 0;">
      <div class="bubble" style="background:#dcf8c6; color:#303030; padding:8px 15px; border-radius:15px 15px 0 15px; max-width:75%; box-shadow:0 1px 2px rgba(0,0,0,0.2); font-size:15px; position:relative;">
        ${query}
        <div style="font-size:10px; color:#888; text-align:right; margin-top:4px;">${time} <span style="color:#34b7f1; font-weight:bold;">✓✓</span></div>
      </div>
    </div>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  // Add user message to history
  chatHistory.push({ role: "user", parts: [{ text: query }] });

  // 2. Show Loading State
  const loadingId = "loading-" + Date.now();
  chatbox.innerHTML += `
    <div class="cmsg mentor" id="${loadingId}" style="display:flex; justify-content:flex-start; margin:10px 0;">
      <div class="bubble" style="background:#ffffff; color:#303030; padding:8px 15px; border-radius:15px 15px 15px 0; max-width:75%; box-shadow:0 1px 2px rgba(0,0,0,0.2); font-size:15px;">
        <div style="display:flex; align-items:center; gap:2px;">
          typing<span class="typing-dot">.</span><span class="typing-dot" style="animation-delay:0.2s;">.</span><span class="typing-dot" style="animation-delay:0.4s;">.</span>
        </div>
      </div>
    </div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  if(!document.getElementById('chat-anim-style')){
    const style = document.createElement('style');
    style.id = 'chat-anim-style';
    style.innerHTML = `
      .typing-dot { animation: typing-blink 1.4s infinite; opacity: 0.2; font-weight: bold; }
      @keyframes typing-blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
    `;
    document.head.appendChild(style);
  }

  let answer = "";
  const cleanQuery = query.toLowerCase().replace(/[?.,!]/g, "").trim();

  // Check if it's a predefined question first
  if (predefinedQA[cleanQuery]) {
    answer = predefinedQA[cleanQuery];
  } else {
    answer = "I am a manual chatbot right now. Please ask me one of the predefined questions!";
  }

  // Small delay to make it feel natural
  await new Promise(r => setTimeout(r, 800));

  // Add AI response to history
  chatHistory.push({ role: "model", parts: [{ text: answer }] });

  // 3. Replace loading text with actual AI answer
  const formattedAnswer = answer
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Handle bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Handle italics
    .replace(/\n/g, '<br>');                           // Handle newlines
      
  document.getElementById(loadingId).querySelector(".bubble").innerHTML = `
    ${formattedAnswer}
    <div style="font-size:10px; color:#888; text-align:left; margin-top:4px;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatbox.scrollTop = chatbox.scrollHeight;
}

function clearChat() {
  document.getElementById("chatbox").innerHTML = "";
  chatHistory = [];
  initChatSuggestions();
}

function generateResume(){
  const getVal = (id) => document.getElementById(id).value;
  
  trackActivity('Generated Resume', `Resume built for ${getVal("name") || 'User'}`);

  const output = `
${getVal("name").toUpperCase()}
${getVal("city")}
${getVal("phone")} • ${getVal("email")}
GitHub: ${getVal("github")} • LinkedIn: ${getVal("linkedin")}

PROFILE
--------------------------------------------------
${getVal("summary")}

TECHNICAL SKILLS
--------------------------------------------------
${getVal("skills")}

EDUCATION
--------------------------------------------------
${getVal("college")}
${getVal("degree")} | Year: ${getVal("gradYear")} | CGPA: ${getVal("cgpa")}

PROJECTS
--------------------------------------------------
${getVal("projTitle")} (${getVal("projTech")})
${getVal("projDesc")}

CERTIFICATIONS
--------------------------------------------------
${getVal("certs")}

ACHIEVEMENTS & ACTIVITIES
--------------------------------------------------
${getVal("achieve")}
`.trim();

  document.getElementById("resumeOutput").textContent = output;
  document.getElementById("resumeOutput").style.display="block";
}

function downloadResume(type = 'pdf'){
    const getVal = (id) => document.getElementById(id).value.trim();

    if (type === 'word') {
        let content = `<html><head><meta charset='utf-8'><title>Resume - ${getVal("name")}</title></head><body style="font-family: Arial, sans-serif;">`;
        content += `<h1 style="text-align: center; color: #333;">${getVal("name").toUpperCase()}</h1>`;
        let contactInfo = [getVal("city"), getVal("phone"), getVal("email")].filter(Boolean).join(' | ');
        content += `<p style="text-align: center; color: #555;">${contactInfo}</p>`;
        let links = [`GitHub: ${getVal("github")}`, `LinkedIn: ${getVal("linkedin")}`].filter(l => l.endsWith(': ') === false);
        if (links.length > 0) {
            content += `<p style="text-align: center; color: #555;">${links.join(' | ')}</p>`;
        }
        content += `<hr/>`;
        if (getVal('summary')) { 
            content += `<h2 style="color: #0055aa;">Profile</h2><p>${getVal('summary').replace(/\n/g, '<br/>')}</p>`;
        }
        if (getVal('skills')) { 
            content += `<h2 style="color: #0055aa;">Technical Skills</h2><ul>`;
            getVal('skills').split(',').forEach(skill => {
                if(skill.trim()) content += `<li>${skill.trim()}</li>`;
            });
            content += `</ul>`;
        }
        if (getVal('college')) {
            content += `<h2 style="color: #0055aa;">Education</h2>`;
            content += `<p><strong>${getVal('college')}</strong><br/>`;
            content += `${getVal('degree')} | Graduation Year: ${getVal('gradYear')}<br/>`;
            if (getVal('cgpa')) { content += `CGPA: ${getVal('cgpa')}`; }
            content += `</p>`;
        }
        if (getVal('projTitle')) {
            content += `<h2 style="color: #0055aa;">Projects</h2>`;
            content += `<p><strong>${getVal('projTitle')}</strong> <em>(${getVal('projTech')})</em></p><ul>`;
            getVal('projDesc').split('\n').filter(item => item.trim()).forEach(item => {
                content += `<li>${item.trim()}</li>`;
            });
            content += `</ul>`;
        }
        if (getVal('certs')) { 
            content += `<h2 style="color: #0055aa;">Certifications</h2><ul>`;
            getVal('certs').split('\n').filter(item => item.trim()).forEach(item => { content += `<li>${item.trim()}</li>`; });
            content += `</ul>`;
        }
        if (getVal('achieve')) { 
            content += `<h2 style="color: #0055aa;">Achievements & Activities</h2><ul>`;
            getVal('achieve').split('\n').filter(item => item.trim()).forEach(item => { content += `<li>${item.trim()}</li>`; });
            content += `</ul>`;
        }
        content += `</body></html>`;
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_${getVal("name").replace(/\s+/g, '_') || 'Generated'}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let cursorY = margin;

    const drawSectionTitle = (title) => {
        if (cursorY > 750) { doc.addPage(); cursorY = margin; } // Add new page if content overflows
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title.toUpperCase(), margin, cursorY);
        cursorY += 8;
        doc.setLineWidth(1.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 15;
    };

    const drawBodyText = (text) => {
        if (!text) return;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, cursorY);
        cursorY += (lines.length * 12) + 10;
    };

    const drawList = (text) => {
        if (!text) return;
        const items = text.split('\n').filter(item => item.trim() !== '');
        items.forEach(item => {
            const itemText = `•  ${item.trim()}`;
            const lines = doc.splitTextToSize(itemText, contentWidth - 10);
            doc.text(lines, margin + 10, cursorY);
            cursorY += (lines.length * 12) + 4;
        });
        cursorY += 10;
    };

    // 1. HEADER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(getVal("name").toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 25;

    let contactInfo = [getVal("city"), getVal("phone"), getVal("email")].filter(Boolean).join('  |  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(contactInfo, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 12;
    
    let links = [`GitHub: ${getVal("github")}`, `LinkedIn: ${getVal("linkedin")}`].filter(l => l.endsWith(': ') === false);
    if (links.length > 0) {
        doc.text(links.join('  |  '), pageWidth / 2, cursorY, { align: 'center' });
    }
    cursorY += 30;

    // 2. SECTIONS
    if (getVal('summary')) { drawSectionTitle('Profile'); drawBodyText(getVal('summary')); }
    if (getVal('skills')) { 
        drawSectionTitle('Technical Skills'); 
        const skills = getVal('skills').split(',');
        skills.forEach(skill => {
            let parts = skill.split(':');
            // If formatted as "Skill: 90", draw a progress bar
            if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
                let name = parts[0].trim();
                let pct = Math.min(Math.max(parseInt(parts[1].trim()), 0), 100); // Keep between 0-100
                if (cursorY > 750) { doc.addPage(); cursorY = margin; }
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(name, margin, cursorY);
                
                // Draw grey background bar
                doc.setFillColor(230, 230, 230);
                doc.rect(margin + 120, cursorY - 8, contentWidth - 120, 8, 'F');
                
                // Draw blue progress fill
                doc.setFillColor(0, 170, 255); // Matches var(--blue)
                doc.rect(margin + 120, cursorY - 8, (contentWidth - 120) * (pct / 100), 8, 'F');
                cursorY += 16;
            } else if (skill.trim() !== "") {
                // Fallback to normal bullet point
                if (cursorY > 750) { doc.addPage(); cursorY = margin; }
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(`•  ${skill.trim()}`, margin + 10, cursorY);
                cursorY += 14;
            }
        });
        cursorY += 10;
    }

    if (getVal('college')) {
        drawSectionTitle('Education');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(getVal('college'), margin, cursorY);
        cursorY += 14;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${getVal('degree')} | Graduation Year: ${getVal('gradYear')}`, margin, cursorY);
        cursorY += 14;
        if (getVal('cgpa')) { doc.text(`CGPA: ${getVal('cgpa')}`, margin, cursorY); }
        cursorY += 20;
    }

    if (getVal('projTitle')) {
        drawSectionTitle('Projects');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(getVal('projTitle'), margin, cursorY);
        doc.setFont('helvetica', 'italic'); doc.setFontSize(10); doc.text(`(${getVal('projTech')})`, pageWidth - margin, cursorY, { align: 'right' });
        cursorY += 15;
        drawList(getVal('projDesc'));
    }

    if (getVal('certs')) { drawSectionTitle('Certifications'); drawList(getVal('certs')); }
    if (getVal('achieve')) { drawSectionTitle('Achievements & Activities'); drawList(getVal('achieve')); }

    doc.save("resume.pdf");
}

let jobMarketChartInstance = null;
let startupChartInstance = null;
let higherStudiesChartInstance = null;
let liveChartInterval = null;

function renderChart(){
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { color: '#c8dff5' }, grid: { color: 'rgba(0,170,255,0.1)' } },
      x: { ticks: { color: '#c8dff5', font: { size: 11 } }, grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) { return `Demand: ${context.parsed.y.toFixed(1)}%`; }
        }
      }
    }
  };

  if(!jobMarketChartInstance) {
    const ctx1 = document.getElementById("jobMarketChart").getContext("2d");
    jobMarketChartInstance = new Chart(ctx1,{
      type:'bar',
      data:{
        labels:[
          "Software Dev", "Data Scientist", "AI/ML Engineer", "Cybersecurity", "Cloud Engineer", "Full Stack Dev",
          "Embedded Sys", "Hardware Design", "Robotics Eng", "VLSI Engineer", "Network Eng", "IoT Engineer"
        ],
        datasets:[{
          data:[88.5, 94.0, 98.5, 91.0, 89.5, 87.0, 82.5, 78.0, 85.5, 81.0, 79.5, 84.0],
          backgroundColor: [
            '#00e5ff', '#00e5ff', '#00e5ff', '#00e5ff', '#00e5ff', '#00e5ff',
            '#ff3366', '#ff3366', '#ff3366', '#ff3366', '#ff3366', '#ff3366'
          ],
          borderRadius: 6
        }]
      },
      options: commonOptions
    });
  }

  if(!startupChartInstance) {
    const ctx2 = document.getElementById("startupTrendsChart").getContext("2d");
    startupChartInstance = new Chart(ctx2,{
      type:'bar',
      data:{
        labels:["Technology Startups", "AI Startups", "E-commerce", "Digital Marketing", "Small Businesses"],
        datasets:[{
          data:[88.0, 96.5, 78.5, 82.0, 74.0],
          backgroundColor: ['#00aaff', '#bf5af2', '#ff9500', '#00ffb3', '#ffd600'],
          borderRadius: 6
        }]
      },
      options: commonOptions
    });
  }

  if(!higherStudiesChartInstance) {
    const ctx3 = document.getElementById("higherStudiesChart").getContext("2d");
    higherStudiesChartInstance = new Chart(ctx3,{
      type:'bar',
      data:{
        labels:["MBA", "Data Science", "Artificial Intelligence", "Cybersecurity", "Biotechnology"],
        datasets:[{
          data:[82.0, 94.5, 98.0, 89.5, 76.0],
          backgroundColor: ['#ff9500', '#00ffb3', '#00aaff', '#ff3366', '#bf5af2'],
          borderRadius: 6
        }]
      },
      options: commonOptions
    });
  }

  // Simulate live dynamic fluctuation
  if (!liveChartInterval) {
    liveChartInterval = setInterval(() => {
      const updateData = (chart) => {
        if (chart) {
          chart.data.datasets[0].data.forEach((val, i) => {
            let change = (Math.random() - 0.5) * 4; // Fluctuate by +/- 2.0%
            let newVal = val + change;
            chart.data.datasets[0].data[i] = Math.max(50, Math.min(100, newVal));
          });
          chart.update(); // Update naturally for smooth animation
        }
      };
      
      updateData(jobMarketChartInstance);
      updateData(startupChartInstance);
      updateData(higherStudiesChartInstance);
    }, 2000); // Tick every 2 seconds for visibility
  }
}

// ===== PARTICLE BACKGROUND ANIMATION (DISABLED FOR REDESIGN) =====
// The particle animation has been disabled to favor a cleaner, more professional UI.

window.onload=function(){
  const initialSection = "roadmap";
  showSection(initialSection);
  // initHigherStudies(); // Now called inside showSection
  // initDegreeFinder(); // Now called inside showSection

  let savedState = localStorage.getItem('careerTestState');
  if(savedState){
    let parsed = JSON.parse(savedState);
    index = parsed.index;
    score = parsed.score || score;
    if(index >= questions.length){
      showResult();
    } else if(index > 0){
      showQuestion();
    }
  }
  // initParticles(); // Disabled for redesign
  renderSavedStartups(); // Load saved startups on boot
  renderSavedSimulations(); // Load saved simulations
  
  trackActivity('Session Started', 'User opened the application');

  // Safeguard: Completely remove the loading overlay so it never blocks clicks
  setTimeout(() => {
    const loader = document.querySelector('.page-transition');
    if (loader) loader.remove();
  }, 1500);

  // LIVE DASHBOARD CONFIGURATION
  if (!sessionStorage.getItem('appSessionStart')) sessionStorage.setItem('appSessionStart', Date.now());
  setInterval(updateLiveDashboard, 3000); // Auto-Refresh loop
}

// ==========================================
// 🎓 SMART DEGREE FINDER LOGIC
// ==========================================

const degreeFields = {
  engineering: {
    title: "Engineering (B.E/B.Tech)",
    description: "Your answers suggest a strong aptitude for logic, problem-solving, and applying scientific principles. An engineering degree would allow you to design, build, and maintain systems, structures, and machines, turning complex ideas into reality.",
    careers: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Aerospace Engineer", "Chemical Engineer"]
  },
  cs_it: {
    title: "Computer Science / IT (B.Sc. CS/IT, BCA, B.Tech)",
    description: "You show a clear interest in technology, logical thinking, and creating digital solutions. A degree in Computer Science or IT will equip you with skills in programming, software development, and data management to build the tech of the future.",
    careers: ["Software Developer", "Data Scientist", "Cybersecurity Analyst", "AI/ML Engineer", "Network Architect"]
  },
  medicine: {
    title: "Medicine / Healthcare (MBBS, BDS, B.Pharm)",
    description: "Your profile indicates a passion for biology, helping others, and meticulous work. A career in medicine or healthcare would be highly rewarding, allowing you to diagnose, treat, and care for people's health and well-being.",
    careers: ["Doctor (Physician)", "Dentist", "Pharmacist", "Biomedical Scientist", "Public Health Specialist"]
  },
  commerce: {
    title: "Commerce / Business (B.Com, BBA)",
    description: "You have an inclination towards economics, management, and financial systems. A degree in commerce or business will prepare you for the corporate world, focusing on finance, accounting, marketing, and business operations.",
    careers: ["Chartered Accountant (CA)", "Financial Analyst", "Marketing Manager", "Investment Banker", "HR Manager"]
  },
  arts_design: {
    title: "Arts / Design (B.A., B.Des, BFA)",
    description: "Your creative and imaginative personality shines through. A degree in arts or design will allow you to express your ideas visually, whether through fine arts, graphic design, fashion, or digital media, creating aesthetically pleasing and impactful work.",
    careers: ["Graphic Designer", "UI/UX Designer", "Animator", "Fashion Designer", "Fine Artist"]
  },
  law: {
    title: "Law (B.A. LLB, BBA LLB)",
    description: "You demonstrate strong communication skills, a sense of justice, and an interest in societal structures. A law degree will train you in legal principles and argumentation, enabling you to advocate for others and uphold the law.",
    careers: ["Corporate Lawyer", "Litigation Lawyer", "Judge", "Legal Advisor", "Human Rights Advocate"]
  },
  science_research: {
    title: "Pure Sciences / Research (B.Sc.)",
    description: "Your curiosity about the natural world and desire for deep knowledge points towards a career in science. A B.Sc. degree will provide a strong foundation for research, experimentation, and discovery in fields like Physics, Chemistry, or Biology.",
    careers: ["Research Scientist", "Professor", "Environmental Scientist", "Astrophysicist", "Statistician"]
  },
  management: {
    title: "Management / Entrepreneurship (BBA, BMS)",
    description: "You exhibit leadership qualities, strategic thinking, and an interest in organizing people and resources. A management degree can fast-track your journey to leading teams, managing projects, or even starting your own business.",
    careers: ["Product Manager", "Management Consultant", "Entrepreneur", "Operations Manager", "Business Development Manager"]
  }
};

const degreeFinderQuestions = [
  {
    question: "Which subject from this list excites you the most?",
    answers: [
      { text: "Physics & Mathematics", scores: { engineering: 3, cs_it: 1, science_research: 2 } },
      { text: "Biology & Chemistry", scores: { medicine: 3, science_research: 2 } },
      { text: "Computer Science & Applications", scores: { cs_it: 3, engineering: 1 } },
      { text: "Business, Accounts & Economics", scores: { commerce: 3, management: 2, law: 1 } }
    ]
  },
  {
    question: "When faced with a complex problem, you tend to:",
    answers: [
      { text: "Break it down logically and find a step-by-step solution.", scores: { engineering: 2, cs_it: 2, science_research: 1 } },
      { text: "Think of creative, out-of-the-box solutions.", scores: { arts_design: 3, management: 1 } },
      { text: "Research extensively to understand all aspects before deciding.", scores: { science_research: 2, law: 2, medicine: 1 } },
      { text: "Organize a team and delegate tasks to solve it.", scores: { management: 3, commerce: 1 } }
    ]
  },
  {
    question: "What kind of work environment do you prefer?",
    answers: [
      { text: "A lab or workshop, doing hands-on experiments or building things.", scores: { engineering: 2, science_research: 2, medicine: 1 } },
      { text: "A modern office, collaborating with a team on a computer.", scores: { cs_it: 2, commerce: 1, management: 1 } },
      { text: "A studio or a flexible space where I can be creative.", scores: { arts_design: 3 } },
      { text: "A dynamic environment like a courtroom, hospital, or a bustling market.", scores: { law: 2, medicine: 2, commerce: 1 } }
    ]
  },
  {
    question: "What's your primary motivation for a career?",
    answers: [
      { text: "To invent or build something new that solves a real-world problem.", scores: { engineering: 2, cs_it: 2, management: 1 } },
      { text: "To help and care for people or living beings.", scores: { medicine: 3 } },
      { text: "To achieve financial success and understand economic systems.", scores: { commerce: 3, management: 2 } },
      { text: "To express my creativity and ideas to the world.", scores: { arts_design: 3 } }
    ]
  },
  {
    question: "Which of these activities sounds most appealing?",
    answers: [
      { text: "Designing a video game or a mobile app.", scores: { cs_it: 3, arts_design: 1 } },
      { text: "Conducting a scientific experiment to discover something new.", scores: { science_research: 3, medicine: 1 } },
      { text: "Arguing a case or debating on a complex topic.", scores: { law: 3 } },
      { text: "Creating a business plan for a new startup.", scores: { management: 3, commerce: 2 } }
    ]
  },
  {
    question: "How do you feel about working with data and numbers?",
    answers: [
      { text: "I love it. I enjoy finding patterns and making calculations.", scores: { cs_it: 2, commerce: 2, science_research: 1, engineering: 1 } },
      { text: "I'm okay with it if it serves a practical purpose.", scores: { engineering: 1, management: 1 } },
      { text: "I prefer working with ideas, words, or visuals.", scores: { arts_design: 2, law: 1 } },
      { text: "I'd rather work with people directly.", scores: { medicine: 1 } }
    ]
  },
  {
    question: "You are more of a:",
    answers: [
      { text: "Logical and analytical thinker.", scores: { engineering: 2, cs_it: 2, law: 1, science_research: 1 } },
      { text: "Creative and intuitive person.", scores: { arts_design: 3 } },
      { text: "Empathetic and caring person.", scores: { medicine: 3 } },
      { text: "Strategic and organized leader.", scores: { management: 3, commerce: 1 } }
    ]
  },
  {
    question: "What kind of impact do you want to make?",
    answers: [
      { text: "Technological advancement and innovation.", scores: { cs_it: 2, engineering: 2, science_research: 1 } },
      { text: "Social justice and policy change.", scores: { law: 3 } },
      { text: "Economic growth and business development.", scores: { commerce: 2, management: 2 } },
      { text: "Cultural and artistic enrichment.", scores: { arts_design: 2 } }
    ]
  },
  {
    question: "How comfortable are you with a long duration of study (e.g., 5+ years)?",
    answers: [
      { text: "Very comfortable, if it leads to a specialized, high-impact career.", scores: { medicine: 2, law: 2, science_research: 2 } },
      { text: "I prefer a standard 3-4 year degree to start my career quickly.", scores: { cs_it: 1, commerce: 1, arts_design: 1 } },
      { text: "I'm open to it, but it's not my first choice.", scores: { engineering: 1, management: 1 } }
    ]
  },
  {
    question: "Which task would you find most satisfying?",
    answers: [
      { text: "Optimizing a complex system for maximum efficiency.", scores: { engineering: 3, cs_it: 2 } },
      { text: "Diagnosing a rare disease.", scores: { medicine: 3 } },
      { text: "Creating a beautiful and functional website.", scores: { cs_it: 2, arts_design: 2 } },
      { text: "Winning a negotiation for a business deal.", scores: { commerce: 2, management: 2, law: 1 } }
    ]
  }
];

let degreeFinderState = {
  currentQuestion: 0,
  scores: {}
};

function initDegreeFinder() {
  const box = document.getElementById("degreeFinderBox");
  if (!box) return;
  box.innerHTML = `
    <div class="anim-slide">
      <div style="font-size: 48px; color: var(--blue); margin-bottom: 10px;"><i class="fa-solid fa-graduation-cap"></i></div>
      <h2 style="font-size: 24px; margin-bottom: 15px; color: var(--text);">Find Your Perfect Degree</h2>
      <p style="color:var(--muted);font-size:16px; margin-bottom: 30px; max-width: 500px; margin: 0 auto 30px;">Answer ${degreeFinderQuestions.length} questions to discover the degree path that best matches your interests and skills after 12th grade.</p>
      <button class="btn btn-blue" onclick="startDegreeFinderTest()"><i class="fa-solid fa-play"></i> Start the Test</button>
    </div>
  `;
}

function startDegreeFinderTest() {
  degreeFinderState = {
    currentQuestion: 0,
    scores: {
      engineering: 0, cs_it: 0, medicine: 0, commerce: 0,
      arts_design: 0, law: 0, science_research: 0, management: 0
    }
  };
  renderDegreeFinderQuestion();
}

function renderDegreeFinderQuestion() {
  const box = document.getElementById("degreeFinderBox");
  const qIndex = degreeFinderState.currentQuestion;

  if (qIndex >= degreeFinderQuestions.length) {
    showDegreeFinderResult();
    return;
  }

  const qData = degreeFinderQuestions[qIndex];
  const progress = Math.round(((qIndex) / degreeFinderQuestions.length) * 100);

  let answersHTML = qData.answers.map((answer, index) =>
    `<button class="likert-btn" onclick="selectDegreeAnswer(${index})">${answer.text}</button>`
  ).join('');

  box.innerHTML = `
    <div class="anim-slide" style="text-align: left; width: 100%;">
      <div class="test-header">
        <div class="q-meta"><i class="fa-solid fa-list-check"></i> QUESTION ${qIndex + 1} OF ${degreeFinderQuestions.length}</div>
      </div>
      <div class="progress-wrap" style="margin-bottom: 25px;"><div class="progress-bar" style="width:${progress}%"></div></div>
      <h2 class="q-text" style="font-size: 20px; margin-bottom: 30px; font-weight: 500; line-height: 1.5; color: var(--text);">${qData.question}</h2>
      <div class="likert-scale">
        ${answersHTML}
      </div>
    </div>
  `;
}

function selectDegreeAnswer(answerIndex) {
  const qIndex = degreeFinderState.currentQuestion;
  const answer = degreeFinderQuestions[qIndex].answers[answerIndex];

  // Add scores
  for (const field in answer.scores) {
    if (degreeFinderState.scores.hasOwnProperty(field)) {
      degreeFinderState.scores[field] += answer.scores[field];
    }
  }

  // Next question
  degreeFinderState.currentQuestion++;
  renderDegreeFinderQuestion();
}

function showDegreeFinderResult() {
  const box = document.getElementById("degreeFinderBox");
  box.innerHTML = `<div class="startup-spinner" style="border-top-color: var(--blue);"></div><p>Analyzing your results...</p>`;

  setTimeout(() => {
    let topField = 'engineering';
    let maxScore = -1;
    for (const field in degreeFinderState.scores) {
      if (degreeFinderState.scores[field] > maxScore) {
        maxScore = degreeFinderState.scores[field];
        topField = field;
      }
    }

    const result = degreeFields[topField];
    trackActivity('Degree Finder Completed', `Recommended: ${result.title}`);

    box.innerHTML = `
      <div class="anim-slide" style="text-align: left;">
        <div class="q-meta" style="text-align: center; margin-bottom: 15px;"><i class="fa-solid fa-award"></i> YOUR RECOMMENDED PATH</div>
        <h2 style="font-size: 28px; color: var(--cyan); margin-bottom: 10px; font-family: 'Orbitron', monospace; text-align: center;">${result.title}</h2>
        
        <div class="decision-reason-box" style="margin-top: 25px;">
          <strong style="color:var(--green); font-size:12px; display:block; margin-bottom:4px;">Why this fits you:</strong>
          <div style="font-size:14px; color:var(--text); line-height: 1.6;">${result.description}</div>
        </div>

        <div class="sim-section-title" style="font-size: 14px; margin-top: 25px;"><i class="fa-solid fa-briefcase"></i> Potential Career Paths</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${result.careers.map(c => `<span class="tool-chip">${c}</span>`).join('')}
        </div>

        <div style="text-align: center; margin-top: 35px;">
          <button class="btn btn-outline" onclick="initDegreeFinder()"><i class="fa-solid fa-rotate-right"></i> Retake Test</button>
        </div>
      </div>
    `;
  }, 1000);
}

// ==========================================
// 🌍 HIGHER STUDIES ADVISOR LOGIC
// ==========================================

const higherStudiesData = {
  fields: {
    "Computer Science & AI": {
      description: "Focuses on creating intelligent systems, developing software, and managing data. It's a fast-growing area with high demand for skilled professionals worldwide.",
      degrees: ["Master of Science (MS) in CS/AI", "PhD in Computer Science", "Master of Data Science"],
      careers: ["AI/ML Engineer", "Software Architect", "Data Scientist", "Research Scientist"],
      tags: ["interest_cs", "learning_practical", "learning_research"]
    },
    "Engineering": {
      description: "Involves designing, building, and maintaining machines, structures, and systems. A core field with specializations in robotics, renewable energy, and smart infrastructure.",
      degrees: ["Master of Engineering (MEng)", "MS in Mechanical/Electrical Eng.", "PhD in Engineering"],
      careers: ["Robotics Engineer", "Renewable Energy Consultant", "Lead Project Engineer"],
      tags: ["interest_eng", "learning_practical"]
    },
    "Business & Management": {
      description: "Prepares you for leadership roles, focusing on strategy, finance, marketing, and operations. An MBA is a globally recognized degree for career acceleration.",
      degrees: ["Master of Business Administration (MBA)", "Master in Management (MIM)", "MS in Finance/Marketing"],
      careers: ["Management Consultant", "Investment Banker", "Product Manager", "Marketing Director"],
      tags: ["interest_biz", "learning_theoretical", "goal_corporate"]
    },
    "Medicine & Healthcare": {
      description: "An advanced field for those dedicated to health sciences, clinical research, and patient care. Requires significant commitment and leads to high-impact careers.",
      degrees: ["Doctor of Medicine (MD) specialization", "Master of Public Health (MPH)", "PhD in Biomedical Sciences"],
      careers: ["Specialist Doctor", "Hospital Administrator", "Medical Researcher", "Public Health Officer"],
      tags: ["interest_med", "learning_research", "goal_service"]
    },
    "Arts & Design": {
      description: "For creative individuals, this field allows specialization in areas like digital media, user experience (UX), animation, and fine arts.",
      degrees: ["Master of Fine Arts (MFA)", "Master of Design (MDes)", "MA in Interaction Design"],
      careers: ["Lead UI/UX Designer", "Creative Director", "Animator for Film/Games", "University Art Professor"],
      tags: ["interest_arts", "learning_practical"]
    }
  },
  countries: {
    "USA": {
      description: "Offers top-ranked universities, cutting-edge research, and vast networking opportunities, especially in tech and business. It is a high-cost option but with many scholarship opportunities.",
      universities: ["MIT", "Stanford University", "Harvard University", "Carnegie Mellon University"],
      scholarships: ["Fulbright-Nehru Fellowships", "Knight-Hennessy Scholars", "University-specific financial aid"],
      tags: ["budget_high", "language_english", "region_na", "interest_cs", "interest_biz", "learning_research"]
    },
    "UK": {
      description: "Home to historic universities with strong reputations. Master's programs are often shorter (1 year), offering a faster route to a career. Cost is moderate to high.",
      universities: ["University of Oxford", "University of Cambridge", "Imperial College London"],
      scholarships: ["Chevening Scholarships", "Commonwealth Scholarships"],
      tags: ["budget_medium", "budget_high", "language_english", "region_eu", "interest_biz", "interest_med"]
    },
    "Canada": {
      description: "Known for its high quality of life, welcoming immigration policies for students, and strong universities in engineering and computer science. More affordable than the USA.",
      universities: ["University of Toronto", "University of British Columbia", "McGill University"],
      scholarships: ["Vanier Canada Graduate Scholarships", "University-specific awards"],
      tags: ["budget_medium", "language_english", "region_na", "interest_cs", "interest_eng"]
    },
    "Germany": {
      description: "A top destination for engineering and research with zero or very low tuition fees in public universities, making it highly affordable. Many programs are taught in English.",
      universities: ["Technical University of Munich", "Heidelberg University", "RWTH Aachen University"],
      scholarships: ["DAAD Scholarships", "Deutschlandstipendium"],
      tags: ["budget_low", "language_english_ok", "region_eu", "interest_eng", "learning_research"]
    },
    "Australia": {
      description: "Offers a great lifestyle and strong universities, particularly in business, IT, and environmental sciences. Post-study work visa opportunities are a major draw.",
      universities: ["Australian National University", "University of Melbourne", "University of Sydney"],
      scholarships: ["Australia Awards Scholarships", "Destination Australia Program"],
      tags: ["budget_medium", "budget_high", "language_english", "region_apac", "interest_biz"]
    }
  }
};

const higherStudiesQuestions = [
  { question: "Which academic field are you most passionate about?", answers: [ { text: "Computer Science, AI, and Software", scores: { interest_cs: 3 } }, { text: "Engineering (Mechanical, Electrical, etc.)", scores: { interest_eng: 3 } }, { text: "Business, Finance, and Management", scores: { interest_biz: 3 } }, { text: "Medicine and Life Sciences", scores: { interest_med: 3 } }, { text: "Arts, Design, and Humanities", scores: { interest_arts: 3 } } ] },
  { question: "What is your preferred learning style?", answers: [ { text: "Practical, hands-on projects and labs", scores: { learning_practical: 2 } }, { text: "Theoretical, reading, and understanding concepts", scores: { learning_theoretical: 2 } }, { text: "Research-oriented, experiments and discovery", scores: { learning_research: 2 } } ] },
  { question: "What is your primary career goal after your higher studies?", answers: [ { text: "A high-paying corporate job", scores: { goal_corporate: 2 } }, { text: "A career in academic research or as a professor", scores: { goal_research: 2, learning_research: 1 } }, { text: "To start my own business/startup", scores: { goal_startup: 2, interest_biz: 1 } }, { text: "A service-oriented role (e.g., healthcare, non-profit)", scores: { goal_service: 2 } } ] },
  { question: "What is your approximate budget for one year of tuition and living expenses?", answers: [ { text: "Below $20,000 (₹16 Lakhs)", scores: { budget_low: 3 } }, { text: "Between $20,000 - $40,000 (₹16-32 Lakhs)", scores: { budget_medium: 3 } }, { text: "Above $40,000 (₹32 Lakhs+)", scores: { budget_high: 3 } } ] },
  { question: "Which region of the world are you most interested in studying in?", answers: [ { text: "North America (USA, Canada)", scores: { region_na: 2 } }, { text: "Europe (UK, Germany, etc.)", scores: { region_eu: 2 } }, { text: "Asia-Pacific (Australia, Singapore, Japan)", scores: { region_apac: 2 } }, { text: "I prefer to study in my home country.", scores: { region_home: 2 } } ] },
  { question: "What is your proficiency in English for academic purposes?", answers: [ { text: "Fluent / Native", scores: { language_english: 2 } }, { text: "Good, but I'd prefer a country with English support", scores: { language_english_ok: 2 } }, { text: "I am willing to learn a new language like German or Japanese", scores: { language_other: 1 } } ] },
  { question: "What type of degree are you aiming for?", answers: [ { text: "A Master's degree (e.g., MS, MBA)", scores: { degree_masters: 2 } }, { text: "A Doctorate (PhD)", scores: { degree_phd: 2, learning_research: 1 } }, { text: "Not sure, open to diplomas or certifications", scores: { degree_other: 2 } } ] },
  { question: "How important is the university's ranking to you?", answers: [ { text: "Very important, I only want to target top-tier universities.", scores: { rank_high: 2, budget_high: 1 } }, { text: "Somewhat important, but I also value affordability.", scores: { rank_medium: 2 } }, { text: "Not important, I care more about the specific program and cost.", scores: { rank_low: 2, budget_low: 1 } } ] },
  { question: "How do you plan to fund your education?", answers: [ { text: "Primarily through scholarships and grants", scores: { funding_scholarship: 2 } }, { text: "Primarily self-funded or with a family loan", scores: { funding_self: 2 } }, { text: "A mix of both scholarships and self-funding", scores: { funding_mix: 2 } } ] },
  { question: "Which of these sounds like a more appealing project to you?", answers: [ { text: "Building a complex AI model to predict stock prices", scores: { interest_cs: 1, interest_biz: 1, learning_practical: 1 } }, { text: "Designing a more efficient electric motor for vehicles", scores: { interest_eng: 1, learning_practical: 1 } }, { text: "Developing a marketing strategy for a global brand", scores: { interest_biz: 1, learning_theoretical: 1 } }, { text: "Discovering a new protein for a medical treatment", scores: { interest_med: 1, learning_research: 1 } } ] }
];

let higherStudiesState = { currentQuestion: 0, scores: {} };
let currentHigherStudiesResult = null; // Store results for downloading

function initHigherStudies() {
  const box = document.getElementById("higherStudiesBox");
  if (!box) return;
  box.innerHTML = `
    <div class="anim-slide">
      <div style="font-size: 48px; color: var(--blue); margin-bottom: 10px;"><i class="fa-solid fa-plane-departure"></i></div>
      <h2 style="font-size: 24px; margin-bottom: 15px; color: var(--text);">Global Higher Studies Advisor</h2>
      <p style="color:var(--muted);font-size:16px; margin-bottom: 30px; max-width: 500px; margin: 0 auto 30px;">Answer ${higherStudiesQuestions.length} questions to find the best country and degree for your higher education.</p>
      <button class="btn btn-blue" onclick="startHigherStudiesTest()"><i class="fa-solid fa-play"></i> Start Advisor</button>
    </div>
  `;
}

function startHigherStudiesTest() {
  higherStudiesState = { currentQuestion: 0, scores: {} };
  renderHigherStudiesQuestion();
}

function renderHigherStudiesQuestion() {
  const box = document.getElementById("higherStudiesBox");
  const qIndex = higherStudiesState.currentQuestion;

  if (qIndex >= higherStudiesQuestions.length) {
    showHigherStudiesResult();
    return;
  }

  const qData = higherStudiesQuestions[qIndex];
  const progress = Math.round(((qIndex) / higherStudiesQuestions.length) * 100);

  let answersHTML = qData.answers.map((answer, index) =>
    `<button class="likert-btn" onclick="selectHigherStudiesAnswer(${index})">${answer.text}</button>`
  ).join('');

  box.innerHTML = `
    <div class="anim-slide" style="text-align: left; width: 100%;">
      <div class="test-header">
        <div class="q-meta"><i class="fa-solid fa-list-check"></i> QUESTION ${qIndex + 1} OF ${higherStudiesQuestions.length}</div>
      </div>
      <div class="progress-wrap" style="margin-bottom: 25px;"><div class="progress-bar" style="width:${progress}%"></div></div>
      <h2 class="q-text" style="font-size: 20px; margin-bottom: 30px; font-weight: 500; line-height: 1.5; color: var(--text);">${qData.question}</h2>
      <div class="likert-scale">${answersHTML}</div>
    </div>
  `;
}

function selectHigherStudiesAnswer(answerIndex) {
  const qIndex = higherStudiesState.currentQuestion;
  const answer = higherStudiesQuestions[qIndex].answers[answerIndex];
  for (const tag in answer.scores) {
    higherStudiesState.scores[tag] = (higherStudiesState.scores[tag] || 0) + answer.scores[tag];
  }
  higherStudiesState.currentQuestion++;
  renderHigherStudiesQuestion();
}

function showHigherStudiesResult() {
  const box = document.getElementById("higherStudiesBox");
  box.innerHTML = `<div class="startup-spinner" style="border-top-color: var(--blue);"></div><p>Analyzing your profile to find the best global opportunities...</p>`;

  setTimeout(() => {
    const scores = higherStudiesState.scores;
    
    // 1. Determine top field
    const interestScores = Object.keys(scores).filter(k => k.startsWith('interest_')).sort((a, b) => scores[b] - scores[a]);
    const topInterestTag = interestScores[0] || 'interest_cs';
    const topField = Object.keys(higherStudiesData.fields).find(f => higherStudiesData.fields[f].tags.includes(topInterestTag)) || "Computer Science & AI";
    const fieldData = higherStudiesData.fields[topField];

    // 2. Determine recommended countries
    let countryScores = {};
    Object.keys(higherStudiesData.countries).forEach(c => {
      countryScores[c] = 0;
      higherStudiesData.countries[c].tags.forEach(tag => {
        if (scores[tag]) countryScores[c] += scores[tag];
      });
    });
    const recommendedCountries = Object.keys(countryScores).sort((a, b) => countryScores[b] - countryScores[a]).slice(0, 3);

    currentHigherStudiesResult = {
      topField: topField,
      fieldData: fieldData,
      recommendedCountries: recommendedCountries.map(c => ({ name: c, data: higherStudiesData.countries[c] }))
    };

    // 3. Generate HTML
    let html = `
      <div class="anim-slide" style="text-align: left;">
        <div class="q-meta" style="text-align: center; margin-bottom: 15px;"><i class="fa-solid fa-award"></i> YOUR HIGHER STUDIES RECOMMENDATION</div>
        <h2 style="font-size: 28px; color: var(--cyan); margin-bottom: 10px; font-family: 'Orbitron', monospace; text-align: center;">${topField}</h2>
        
        <div class="decision-reason-box" style="margin-top: 25px;">
          <strong style="color:var(--green); font-size:12px; display:block; margin-bottom:4px;">Why this field fits you:</strong>
          <div style="font-size:14px; color:var(--text); line-height: 1.6;">${fieldData.description}</div>
        </div>

        <div class="sim-section-title" style="font-size: 14px; margin-top: 25px;"><i class="fa-solid fa-graduation-cap"></i> Recommended Degrees</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">${fieldData.degrees.map(c => `<span class="tool-chip">${c}</span>`).join('')}</div>

        <div class="sim-section-title" style="font-size: 14px; margin-top: 25px;"><i class="fa-solid fa-globe"></i> Top Recommended Countries</div>
    `;

    recommendedCountries.forEach(countryName => {
      const countryData = higherStudiesData.countries[countryName];
      html += `
        <div class="timeline-content" style="margin-bottom:15px;">
          <div class="timeline-year" style="font-size:16px;">${countryName}</div>
          <p style="font-size:13px; color:var(--text-secondary); margin-bottom:15px;">${countryData.description}</p>
          <div class="sim-data-grid">
            <div class="sim-data-box"><div class="sim-data-title">Example Universities</div><div class="sim-data-value">${countryData.universities.join(", ")}</div></div>
            <div class="sim-data-box"><div class="sim-data-title">Scholarship Info</div><div class="sim-data-value">${countryData.scholarships.join(", ")}</div></div>
          </div>
        </div>
      `;
    });

    html += `
        <div class="sim-section-title" style="font-size: 14px; margin-top: 25px;"><i class="fa-solid fa-briefcase"></i> Potential Career Paths</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">${fieldData.careers.map(c => `<span class="tool-chip">${c}</span>`).join('')}</div>

        <div class="sim-section-title" style="font-size: 14px; margin-top: 35px;"><i class="fa-solid fa-link"></i> Apply for Higher Studies</div>
        <div class="sim-data-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
    `;

    const applicationLinks = [
      { name: "IELTS Exam", desc: "Book your official English language proficiency test required globally.", url: "https://www.ielts.org/for-test-takers/book-a-test", btn: "Book Test" },
      { name: "TOEFL Exam", desc: "Alternative English proficiency exam widely accepted in North America.", url: "https://www.ets.org/toefl/test-takers/ibt/register.html", btn: "Register Now" },
      { name: "GRE Exam", desc: "Graduate Record Examination, required for many Master's and PhD programs.", url: "https://www.ets.org/gre/test-takers/general-test/register.html", btn: "Register Now" },
      { name: "Common App (US)", desc: "The official centralized application portal for universities in the United States.", url: "https://www.commonapp.org/", btn: "Apply to US" },
      { name: "UCAS Portal (UK)", desc: "The official centralized admissions service for all UK universities.", url: "https://www.ucas.com/", btn: "Apply to UK" },
      { name: "Global Scholarships", desc: "Search and apply for thousands of international scholarships and financial aid.", url: "https://www.internationalscholarships.com/", btn: "Find Funds" }
    ];

    applicationLinks.forEach(link => {
      html += `
          <div class="sim-data-box" style="display:flex; flex-direction:column; justify-content:space-between; gap:12px; border-left-color: var(--cyan);">
            <div>
              <div style="color:var(--cyan); font-size:13px; font-weight:600; font-family:'Orbitron', monospace; letter-spacing:1px; margin-bottom:6px;">${link.name}</div>
              <div style="font-size:12px; color:var(--text-secondary); line-height: 1.5;">${link.desc}</div>
            </div>
            <a href="${link.url}" target="_blank" class="btn btn-outline" style="display:block; text-align:center; padding: 8px 12px; font-size: 10px; width: 100%; border-color: rgba(0, 229, 255, 0.3) !important; color: var(--cyan); text-decoration: none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${link.btn}</a>
          </div>
      `;
    });

    html += `
        </div>

        <div class="resume-btns" style="margin-top: 40px; justify-content: center;">
          <button class="btn btn-outline" onclick="initHigherStudies()"><i class="fa-solid fa-rotate-right"></i> Retake Advisor</button>
          <button class="btn btn-blue" onclick="downloadHigherStudies('pdf')"><i class="fa-solid fa-file-pdf"></i> Download PDF</button>
          <button class="btn btn-blue" onclick="downloadHigherStudies('word')"><i class="fa-solid fa-file-word"></i> Download Word</button>
        </div>
      </div>
    `;
    box.innerHTML = html;

  }, 1000);
}

function downloadHigherStudies(type) {
  if (!currentHigherStudiesResult) return;
  const res = currentHigherStudiesResult;

  // Prepare text content
  let text = `Higher Studies Recommendation: ${res.topField}\n\n`;
  text += `Why this field fits you:\n${res.fieldData.description}\n\n`;
  text += `Recommended Degrees:\n${res.fieldData.degrees.join(", ")}\n\n`;
  text += `Potential Career Paths:\n${res.fieldData.careers.join(", ")}\n\n`;
  text += `Top Recommended Countries:\n`;
  res.recommendedCountries.forEach(c => {
    text += `- ${c.name}:\n  ${c.data.description}\n  Example Universities: ${c.data.universities.join(", ")}\n  Scholarships: ${c.data.scholarships.join(", ")}\n\n`;
  });

  if (type === 'word') {
    let content = `<html><head><meta charset='utf-8'><title>Higher Studies Advisor</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6;">`;
    content += `<h1 style="color: #0055aa; text-align: center;">Higher Studies Recommendation: ${res.topField}</h1><hr/>`;
    content += `<h3 style="color: #0055aa;">Why this field fits you:</h3><p>${res.fieldData.description}</p>`;
    content += `<h3 style="color: #0055aa;">Recommended Degrees:</h3><ul>${res.fieldData.degrees.map(d=>`<li>${d}</li>`).join('')}</ul>`;
    content += `<h3 style="color: #0055aa;">Potential Career Paths:</h3><ul>${res.fieldData.careers.map(c=>`<li>${c}</li>`).join('')}</ul>`;
    content += `<h3 style="color: #0055aa;">Top Recommended Countries:</h3>`;
    res.recommendedCountries.forEach(c => {
      content += `<h4>${c.name}</h4><p>${c.data.description}</p>`;
      content += `<ul><li><strong>Example Universities:</strong> ${c.data.universities.join(", ")}</li>`;
      content += `<li><strong>Scholarships:</strong> ${c.data.scholarships.join(", ")}</li></ul>`;
    });
    content += `</body></html>`;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Higher_Studies_${res.topField.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const lines = doc.splitTextToSize(text, 500);
    doc.setFontSize(16); doc.text(`Higher Studies: ${res.topField}`, 40, 40);
    doc.setFontSize(10); doc.text(lines, 40, 70);
    doc.save(`Higher_Studies_${res.topField.replace(/\s+/g, '_')}.pdf`);
  }
}

// ==========================================
// 🚀 STARTUP IDEA GENERATOR LOGIC
// ==========================================

let currentGeneratedIdea = null;

function generateIdeaLocally(input, ideasDataset) {
  console.log("User Input:", input);
  const { interest, budget } = input;
  let localIdeas = ideasDataset;

  let budgetTerm = budget.split(" ")[0];
  if (budgetTerm === "Zero" || budgetTerm === "Micro") {
    budgetTerm = "Low";
  }
  const interestTerm = interest.split(" ")[0];

  // Tier 1: Strict match on budget AND interest
  let filtered = localIdeas.filter(i => 
    i.budget.toLowerCase().includes(budgetTerm.toLowerCase()) && 
    i.category.toLowerCase().includes(interestTerm.toLowerCase())
  );

  // Tier 2: Match on interest only, if strict match fails
  if (filtered.length === 0) {
    filtered = localIdeas.filter(i => i.category.toLowerCase().includes(interestTerm.toLowerCase()));
  }

  // Tier 3: No filters matched, use all ideas as a final fallback
  if (filtered.length === 0) {
    console.log("No exact match found. Here is a recommended startup idea for you.");
    filtered = localIdeas;
  }
  
  const randomIdea = filtered[Math.floor(Math.random() * filtered.length)];
  
  const idea = {
    name: randomIdea.name,
    tagline: `A ${randomIdea.type} in ${randomIdea.category}`,
    description: randomIdea.description,
    problem: randomIdea.problem || "Existing solutions are too expensive or inefficient.",
    solution: randomIdea.solution || "An optimized, automated, and accessible alternative.",
    targetAudience: randomIdea.targetAudience || "Small businesses and independent creators.",
    revenueModel: randomIdea.revenueModel || "Subscription / Pay-per-use",
    difficulty: randomIdea.difficulty || "Medium",
    growth: randomIdea.growth || "High Scalability",
    steps: randomIdea.steps || ["Market Research", "Build MVP", "Launch Beta", "Gather Feedback"]
  };

  console.log("Generated Idea:", idea);
  return idea;
}

async function generateStartup() {
  const interest = document.getElementById("suInterest").value || "General Tech";
  const budget = document.getElementById("suBudget").value || "Low";
  const goal = document.getElementById("suGoal").value || "Startup";
  const time = document.getElementById("suTime").value || "Part-time";
  const skills = document.getElementById("suSkills").value || "General IT skills";

  document.getElementById("startupOutput").innerHTML = "";
  document.getElementById("startupLoading").style.display = "block";

  const userInput = { interest, budget, goal, time, skills };

  let ideasDataset = [];
  try {
    const response = await fetch("startupIdeas.json");
    if (response.ok) {
      ideasDataset = await response.json();
    } else {
      throw new Error("Failed to load startup ideas.");
    }
  } catch (err) {
      console.error("Fetch failed:", err);
      document.getElementById("startupLoading").style.display = "none";
      document.getElementById("startupOutput").innerHTML = `<p style="color:var(--red); background:rgba(255,0,0,0.1); padding:15px; border-radius:8px;">Error loading startup ideas. Please ensure you are running the project on a local web server (e.g., Live Server) to access the JSON file.</p>`;
      return; // Stop execution to prevent errors
  }

  setTimeout(() => {
    try {
      const ideaData = generateIdeaLocally(userInput, ideasDataset);
      currentGeneratedIdea = ideaData;
      document.getElementById("startupLoading").style.display = "none";
      trackActivity('Generated Startup', `Idea for ${interest}`);
      renderStartupIdea(ideaData);
    } catch (error) {
      console.error("Error generating idea:", error);
      document.getElementById("startupLoading").style.display = "none";
        document.getElementById("startupOutput").innerHTML = `<p style="color:var(--red); background:rgba(255,0,0,0.1); padding:15px; border-radius:8px;">An unexpected error occurred. Please ensure all inputs are selected.</p>`;
    }
  }, 600); // 600ms artificial delay to simulate calculation time
}

function renderStartupIdea(idea) {
  const outputDiv = document.getElementById("startupOutput");
  
  let stepsHtml = idea.steps.map(s => `<li>${s}</li>`).join("");

  outputDiv.innerHTML = `
    <div class="startup-result-card">
      <div class="startup-header">
        <div class="startup-name">${idea.name}</div>
        <div class="startup-tagline">"${idea.tagline}"</div>
      </div>
      
      <div class="startup-tags">
        <span class="s-tag diff"><i class="fa-solid fa-gauge-high"></i> Difficulty: ${idea.difficulty}</span>
        <span class="s-tag growth"><i class="fa-solid fa-arrow-trend-up"></i> Growth: ${idea.growth}</span>
        <span class="s-tag rev"><i class="fa-solid fa-sack-dollar"></i> Model: ${idea.revenueModel}</span>
      </div>

      <div class="startup-detail-box">
        <div class="startup-detail-title">Description</div>
        <div class="startup-detail-content">${idea.description}</div>
      </div>

      <div class="resume-grid" style="margin-bottom:0;">
        <div class="startup-detail-box" style="border-left-color: var(--red);">
          <div class="startup-detail-title" style="color: var(--red);">The Problem</div>
          <div class="startup-detail-content">${idea.problem}</div>
        </div>
        <div class="startup-detail-box" style="border-left-color: var(--green);">
          <div class="startup-detail-title" style="color: var(--green);">The Solution</div>
          <div class="startup-detail-content">${idea.solution}</div>
        </div>
      </div>

      <div class="startup-detail-box" style="border-left-color: var(--purple);">
        <div class="startup-detail-title" style="color: var(--purple);">Target Audience</div>
        <div class="startup-detail-content">${idea.targetAudience}</div>
      </div>

      <div class="resume-btns" style="margin-top: 25px;">
        <button class="btn btn-outline" onclick="generateStartup()"><i class="fa-solid fa-rotate-right"></i> Regenerate</button>
        <button class="btn btn-green" onclick="saveCurrentIdea()"><i class="fa-solid fa-floppy-disk"></i> Save Idea</button>
        <button class="btn btn-blue" onclick="downloadStartupIdea('pdf')"><i class="fa-solid fa-file-pdf"></i> Download PDF</button>
        <button class="btn btn-blue" onclick="downloadStartupIdea('word')"><i class="fa-solid fa-file-word"></i> Download Word</button>
        <button class="btn btn-outline" onclick="document.getElementById('execSteps').classList.toggle('expanded')" style="border-color: var(--text-secondary) !important; color: var(--text);"><i class="fa-solid fa-list-check"></i> Execution Steps</button>
      </div>

      <div id="execSteps" class="startup-steps">
        <div class="startup-detail-title" style="color: var(--cyan); margin-bottom:10px;">First Steps to Execute:</div>
        <ul>${stepsHtml}</ul>
      </div>
    </div>
  `;
}

function saveCurrentIdea() {
  if (!currentGeneratedIdea) return;
  let saved = JSON.parse(localStorage.getItem("savedStartups") || "[]");
  saved.push(currentGeneratedIdea);
  localStorage.setItem("savedStartups", JSON.stringify(saved));
  alert("Idea saved successfully!");
  renderSavedStartups();
}

function downloadStartupIdea(type = 'pdf') {
  if (!currentGeneratedIdea) return;
  const idea = currentGeneratedIdea;
  // Utilizing existing download logic
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  doc.setFontSize(22);
  doc.text(idea.name.toUpperCase(), 40, 40);
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(idea.description, 500);
  doc.text(lines, 40, 70);
  doc.save(`Startup_Idea_${idea.name.replace(/\s+/g, '_')}.pdf`);
}

function deleteSavedIdea(index) {
  let saved = JSON.parse(localStorage.getItem("savedStartups") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedStartups", JSON.stringify(saved));
  renderSavedStartups();
}

function renderSavedStartups() {
  const grid = document.getElementById("savedStartupsGrid");
  if(!grid) return;
  let saved = JSON.parse(localStorage.getItem("savedStartups") || "[]");
  
  if (saved.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted); font-size: 14px;">No ideas saved yet.</p>`;
    return;
  }

  grid.innerHTML = saved.map((idea, idx) => `
    <div class="saved-card">
      <button class="delete-saved-btn" onclick="deleteSavedIdea(${idx})" title="Delete"><i class="fa-solid fa-xmark"></i></button>
      <div class="saved-card-name">${idea.name}</div>
      <div class="saved-card-tag">${idea.tagline}</div>
      <div style="font-size: 12px; color: var(--text-secondary);">${idea.description.substring(0, 80)}...</div>
    </div>
  `).join("");
}


// ==========================================
// 🧠 AI LIFE SIMULATOR (DECISION ENGINE)
// ==========================================

let currentSimulationData = null;
let currentSimParams = null;

function generateAdvancedSimulation() {
  const status = document.getElementById("simStatus").value || "Beginner";
  const finance = document.getElementById("simFinance").value || "Medium";
  const risk = document.getElementById("simRisk").value || "Medium";
  const time = document.getElementById("simTime").value || "Full-time (40 hrs/week)";
  const marks = document.getElementById("simMarks").value || "Average";
  const goal = document.getElementById("simGoal").value || "Career Success";
  const skills = document.getElementById("simSkills").value || "General Tech Skills";
  const interests = document.getElementById("simInterests").value || "General IT";

  currentSimParams = { status, finance, risk, time, marks, goal, skills, interests };

  document.getElementById("simOutputMain").innerHTML = "";
  document.getElementById("simLoading").style.display = "block";

  // Adding a slight delay to simulate "AI thinking" for better user experience
  setTimeout(() => {
    try {
      const simData = analyzeUser(currentSimParams);
      trackActivity('Simulation Run', `Generated path: ${simData.selectedPath}`);
      document.getElementById("simLoading").style.display = "none";
      
      currentSimulationData = simData;
      renderSimulationData(simData);
    } catch(error) {
      console.error("Simulation Engine Error:", error);
      document.getElementById("simLoading").style.display = "none";
      document.getElementById("simOutputMain").innerHTML = `<p style="color:var(--red); background:rgba(255,0,0,0.1); padding:15px; border-radius:8px;">An error occurred while generating your simulation. Please ensure all inputs are selected properly.</p>`;
    }
  }, 800);
}

function analyzeUser(params) {
  // 1. INPUT PARSING & WEIGHTS
  const skillsLower = params.skills.toLowerCase();
  const interestLower = params.interests.toLowerCase();
  const isHighRisk = params.risk === "High";
  const isLowRisk = params.risk === "Low";
  const isFullTime = params.time.includes("Full-time") || params.time.includes("All-in");
  const isPartTime = params.time.includes("Part-time");
  const hasTechBiz = /tech|business|code|marketing|manage|python|java|html|css|js|react/i.test(skillsLower);
  const isResearch = /research|core|science|study|phd|master/i.test(interestLower);
  const isBeginner = params.status === "Beginner" || params.status === "Student";
  const isLowFinance = params.finance === "Low";
  
  // Parse marks safely
  let marksNum = parseFloat(params.marks.replace(/[^0-9.]/g, ''));
  if (isNaN(marksNum)) {
    if (params.marks.toLowerCase().includes("high") || params.marks.toLowerCase().includes("excellent") || params.marks.toLowerCase().includes("9") || params.marks.toLowerCase().includes("10")) marksNum = 9;
    else marksNum = 7;
  }
  
  const primarySkill = params.skills.split(",")[0].trim() || "General Operations";
  const primaryInterest = params.interests.split(",")[0].trim() || "Tech";

  // 2. DYNAMIC DECISION ENGINE
  let path = "Corporate Job"; 
  let reason = "";
  let whyNotOthers = "";
  
  // Apply core rules
  if (isHighRisk && hasTechBiz && isFullTime) {
    path = "Business";
    reason = `Your high risk tolerance, full-time availability, and background in ${primarySkill} make you an ideal candidate to build a startup in the ${primaryInterest} space.`;
    whyNotOthers = "A traditional corporate job caps your potential upside, and higher studies would unnecessarily delay your entry into the fast-moving market.";
  } else if (marksNum >= 8 && isResearch) {
    path = "Higher Studies";
    reason = `With a strong academic record (${params.marks}) and an interest in ${primaryInterest}, pursuing advanced research or higher education offers the best long-term leverage.`;
    whyNotOthers = "Immediate corporate jobs might underutilize your academic potential, and business ventures require capital over research.";
  } else {
    path = "Corporate Job";
    reason = `Given your ${params.risk} risk tolerance and ${params.time} availability, a corporate trajectory in ${primarySkill} provides the most reliable foundation to reach your goal of ${params.goal}.`;
    whyNotOthers = "Business requires high immediate capital/risk which contradicts your profile, while higher studies require upfront investment without immediate financial returns.";
  }

  // 3. DYNAMIC SIMULATION GENERATOR
  let baseSalary = isBeginner ? 4 : 8; // in Lakhs
  if (isFullTime) baseSalary += 2;
  if (isPartTime) baseSalary -= 2;
  if (hasTechBiz) baseSalary += 2;

  const rolePrefix = isBeginner ? "Junior" : "Lead";
  const targetRole = path === "Business" ? `Founder (${primaryInterest})` : path === "Higher Studies" ? `Researcher / Scholar` : `${rolePrefix} ${primarySkill} Specialist`;

  let sim = {};
  
  if (path === "Business") {
    const y1Inc = isLowFinance ? "Bootstrap / ₹0 (Reinvesting)" : `Seed / Drawing ₹${(baseSalary/2).toFixed(1)}L/yr`;
    const y3Inc = isHighRisk ? `₹${(baseSalary * 3).toFixed(1)}L/yr or ₹0 (Boom/Bust)` : `₹${(baseSalary * 1.5).toFixed(1)}L/yr (Profitable)`;
    const y5Inc = isHighRisk ? "Acquisition / ₹1Cr+ Equity" : `₹${(baseSalary * 4).toFixed(1)}L/yr (Stable Scale)`;
    sim = {
      oneYear: { stage: `Early Stage ${targetRole}`, income: y1Inc, skills: ["Hustling", "Sales", `Applying ${primarySkill} to Product`], activities: ["Building MVP", `Finding ${primaryInterest} Customers`] },
      threeYear: { stage: `Scaling ${targetRole}`, income: y3Inc, achievements: ["Product-Market Fit", "Hired initial team", "Secured key partnerships"], skills: ["Leadership", "Operations Management", "Pitching"] },
      fiveYear: { stage: "Established Business Owner", income: y5Inc, stability: isHighRisk ? "Volatile but Lucrative" : "Moderate-High", lifestyle: "High autonomy, intense responsibility, unlimited upside." }
    };
  } else if (path === "Higher Studies") {
    const y1Inc = isPartTime ? `Part-time Job / ₹${(baseSalary/2).toFixed(1)}L/yr` : `Stipend / ₹${(baseSalary/3).toFixed(1)}L/yr`;
    const y5Inc = `Premium Salary / ₹${(baseSalary * 2.5).toFixed(1)}L/yr`;
    sim = {
      oneYear: { stage: "Master's/PhD Student", income: y1Inc, skills: [`Advanced ${primarySkill}`, "Academic Writing", "Methodology"], activities: ["Intense Coursework", `Deep-dive into ${primaryInterest} Literature`] },
      threeYear: { stage: "Graduating / Post-Doc", income: `High Starting Package / ₹${(baseSalary * 1.5).toFixed(1)}L/yr`, achievements: ["Published Papers", `Deep Specialization in ${primaryInterest}`], skills: ["Data Analysis", "Domain Mastery"] },
      fiveYear: { stage: "Subject Matter Expert / R&D", income: y5Inc, stability: "Very High", lifestyle: "Intellectually stimulating, prestigious, geographically flexible." }
    };
  } else {
    const y1Inc = isPartTime ? `₹${(baseSalary * 0.6).toFixed(1)}L/yr (Part-time)` : `₹${baseSalary.toFixed(1)}L/yr`;
    const y3Inc = isPartTime ? `₹${(baseSalary * 0.9).toFixed(1)}L/yr` : `₹${(baseSalary * 1.6).toFixed(1)}L/yr`;
    const y5Inc = isPartTime ? `₹${(baseSalary * 1.2).toFixed(1)}L/yr` : `₹${(baseSalary * 2.4).toFixed(1)}L/yr`;
    sim = {
      oneYear: { stage: targetRole, income: y1Inc, skills: ["Corporate Communication", `Practical ${primarySkill}`, "Agile Workflows"], activities: ["Onboarding", `Delivering ${primaryInterest} projects`, "Networking"] },
      threeYear: { stage: `Mid-Level ${primarySkill} Expert`, income: y3Inc, achievements: ["Leading minor projects", "Recognized Domain Expertise"], skills: ["Mentorship", "Advanced Technicals", "Cross-team Collab"] },
      fiveYear: { stage: `Senior/Lead Position (${params.goal})`, income: y5Inc, stability: isLowRisk ? "Extremely High" : "High", lifestyle: "Comfortable, good work-life balance, high disposable income." }
    };
  }

  // 4. DYNAMIC ACTION PLAN GENERATOR
  let plan = { "30days": [], "3months": [], "6months": [], "1year": [] };
  
  // Universal starting step based on status
  if (isBeginner) plan["30days"].push(`Start structured learning/courses specifically in ${primarySkill}.`);
  else plan["30days"].push(`Audit current portfolio and optimize it around ${primarySkill} and ${primaryInterest}.`);

  if (path === "Business") {
    plan["30days"].push(isLowFinance ? `Validate ${primaryInterest} idea with zero cost using organic social media` : `Draft pitch deck and allocate initial budget for ${primaryInterest} prototype`);
    plan["30days"].push("Draft a lean business model canvas");
    plan["3months"].push(`Launch MVP using your ${primarySkill} skills to early adopters`);
    plan["3months"].push(isHighRisk ? "Run aggressive paid marketing tests" : "Acquire first 10-50 customers organically");
    plan["6months"].push("Achieve consistent monthly revenue and gather user testimonials");
    plan["6months"].push(isFullTime ? "Dedicate 100% focus to scaling operations" : "Balance side-hustle tasks without burning out");
    plan["1year"].push(isLowFinance ? "Reinvest all profits to grow without external funding" : "Explore Angel/Seed funding options");
    plan["1year"].push("Hire first contractor or employee to offload operational tasks");
  } else if (path === "Higher Studies") {
    plan["30days"].push(`Shortlist target universities known for ${primaryInterest} programs`);
    plan["30days"].push("Prepare for entrance exams (GRE/GATE/IELTS)");
    plan["3months"].push("Draft Statement of Purpose connecting your past to your future goals");
    plan["3months"].push(isBeginner ? "Secure academic letters of recommendation" : "Secure professional letters of recommendation");
    plan["6months"].push("Submit all applications and actively apply for scholarships/grants");
    plan["6months"].push(isLowFinance ? "Secure student loans or graduate assistantships" : "Arrange personal finances and visas");
    plan["1year"].push(`Begin first semester focusing heavily on ${primarySkill} fundamentals`);
    plan["1year"].push("Identify a core thesis topic and connect with research professors");
  } else {
    plan["30days"].push(`Update Resume & LinkedIn highlighting ${primarySkill}`);
    plan["30days"].push(isLowRisk ? `Apply to 20+ stable corporate ${targetRole} positions` : `Apply to high-growth startup ${targetRole} positions`);
    plan["3months"].push(`Prepare extensively for technical interviews testing ${primarySkill}`);
    plan["3months"].push("Clear interviews and complete company onboarding");
    plan["6months"].push(`Deliver first major project involving ${primaryInterest}`);
    plan["6months"].push("Build internal network and identify mentors within the company");
    plan["1year"].push(isPartTime ? "Request transition to full-time or higher hourly rate" : "Complete annual performance review and negotiate a raise");
    plan["1year"].push("Plan the next 2-year trajectory towards your ultimate goal");
  }

  // 5. DYNAMIC ANALYSIS METRICS
  let probNum = 65;
  if (isFullTime) probNum += 15;
  else if (isPartTime) probNum -= 10;
  if (isHighRisk) probNum -= 15;
  if (!isBeginner) probNum += 20;
  if (path === "Business" && isLowFinance) probNum -= 10;
  probNum = Math.min(Math.max(probNum, 10), 98); // clamp between 10-98

  let diff = isBeginner ? "High" : "Medium";
  if (path === "Business") diff = isLowFinance ? "Very High" : "High";
  if (path === "Corporate Job" && !isBeginner) diff = "Low-Medium";

  let backup = "";
  if (path === "Business") backup = `Leverage your hands-on experience in ${primarySkill} to pivot into a Corporate Product Manager or Lead role.`;
  else if (path === "Higher Studies") backup = `Pause studies and enter the corporate market directly as a ${targetRole}.`;
  else backup = `Pivot to freelance consulting in ${primaryInterest} or upskill in adjacent domains.`;

  // Format download output
  const downloadSummary = `AI Life Simulation Report
Path: ${path}
Goal: ${params.goal}
Reason: ${reason}

--- 1 YEAR OUTLOOK ---
Stage: ${sim.oneYear.stage}
Income: ${sim.oneYear.income}

--- 3 YEAR OUTLOOK ---
Stage: ${sim.threeYear.stage}
Income: ${sim.threeYear.income}

--- 5 YEAR OUTLOOK ---
Stage: ${sim.fiveYear.stage}
Income: ${sim.fiveYear.income}
Stability: ${sim.fiveYear.stability}`;

  return {
    selectedPath: path,
    reason: reason,
    whyNotOthers: whyNotOthers,
    simulation: sim,
    actionPlan: plan,
    analysis: {
      successProbability: `${probNum}%`,
      riskLevel: params.risk,
      difficulty: diff,
      backupPlan: backup 
    },
    download: {
      pdfContent: downloadSummary,
      wordContent: downloadSummary
    }
  };
}

function renderSimulationData(data) {
  const container = document.getElementById("simOutputMain");
  
  const riskClass = data.analysis.riskLevel.toLowerCase().includes('high') ? 'high-risk' : 
                   (data.analysis.riskLevel.toLowerCase().includes('medium') ? 'med-risk' : '');

  let html = `
    <div class="decision-card">
      <div style="font-size: 12px; color: var(--muted); text-transform:uppercase; letter-spacing: 2px;">AI Selected Path:</div>
      <div class="decision-path"><i class="fa-solid fa-route"></i> ${data.selectedPath}</div>
      
      <div class="decision-reason-box">
        <strong style="color:var(--green); font-size:12px; display:block; margin-bottom:4px;">Why this path?</strong>
        <div style="font-size:14px; color:var(--text); line-height: 1.5;">${data.reason}</div>
      </div>
      <div class="decision-reason-box alt">
        <strong style="color:var(--orange); font-size:12px; display:block; margin-bottom:4px;">Why not the others?</strong>
        <div style="font-size:14px; color:var(--text); line-height: 1.5;">${data.whyNotOthers}</div>
      </div>

      <!-- Analysis Grid -->
      <div class="analysis-grid">
        <div class="analysis-stat">
          <div class="sim-data-title">Success Prob.</div>
          <div class="stat-val" style="color:var(--cyan);">${data.analysis.successProbability}</div>
        </div>
        <div class="analysis-stat ${riskClass}">
          <div class="sim-data-title">Risk Level</div>
          <div class="stat-val">${data.analysis.riskLevel}</div>
        </div>
        <div class="analysis-stat">
          <div class="sim-data-title">Difficulty</div>
          <div class="stat-val">${data.analysis.difficulty}</div>
        </div>
      </div>
      <div style="background:rgba(255,51,102,0.1); border:1px dashed var(--red); padding:12px; border-radius:8px; font-size:13px; margin-bottom:30px;">
        <strong style="color:var(--red);">Backup Plan:</strong> ${data.analysis.backupPlan}
      </div>

      <!-- Timeline -->
      <div class="sim-section-title"><i class="fa-solid fa-clock-rotate-left"></i> Future Simulation Timeline</div>
      <div class="timeline">
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content">
          <div class="timeline-year">Year 1</div>
          <div style="font-size:15px; font-weight:600; color:var(--text);">${data.simulation.oneYear.stage}</div>
          <div style="font-size:13px; color:var(--green); margin-bottom:10px;"><i class="fa-solid fa-money-bill-trend-up"></i> ${data.simulation.oneYear.income}</div>
          <div class="sim-data-grid">
            <div class="sim-data-box"><div class="sim-data-title">Skills Gained</div><div class="sim-data-value">${data.simulation.oneYear.skills.join(", ")}</div></div>
            <div class="sim-data-box"><div class="sim-data-title">Key Activities</div><div class="sim-data-value">${data.simulation.oneYear.activities.join(", ")}</div></div>
          </div>
        </div></div>

        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content">
          <div class="timeline-year">Year 3</div>
          <div style="font-size:15px; font-weight:600; color:var(--text);">${data.simulation.threeYear.stage}</div>
          <div style="font-size:13px; color:var(--green); margin-bottom:10px;"><i class="fa-solid fa-money-bill-trend-up"></i> ${data.simulation.threeYear.income}</div>
          <div class="sim-data-grid">
            <div class="sim-data-box"><div class="sim-data-title">Achievements</div><div class="sim-data-value">${data.simulation.threeYear.achievements.join(", ")}</div></div>
            <div class="sim-data-box"><div class="sim-data-title">Skills Gained</div><div class="sim-data-value">${data.simulation.threeYear.skills.join(", ")}</div></div>
          </div>
        </div></div>

        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content">
          <div class="timeline-year">Year 5</div>
          <div style="font-size:15px; font-weight:600; color:var(--text);">${data.simulation.fiveYear.stage}</div>
          <div style="font-size:13px; color:var(--green); margin-bottom:10px;"><i class="fa-solid fa-money-bill-trend-up"></i> ${data.simulation.fiveYear.income}</div>
          <div class="sim-data-grid">
            <div class="sim-data-box"><div class="sim-data-title">Stability</div><div class="sim-data-value">${data.simulation.fiveYear.stability}</div></div>
            <div class="sim-data-box"><div class="sim-data-title">Lifestyle</div><div class="sim-data-value">${data.simulation.fiveYear.lifestyle}</div></div>
          </div>
        </div></div>
      </div>

      <!-- Action Plan -->
      <div class="sim-section-title"><i class="fa-solid fa-list-check"></i> Step-by-Step Action Plan</div>
      <div class="action-plan-grid">
        <div class="action-card"><h4>First 30 Days</h4><ul>${data.actionPlan["30days"].map(x=>`<li>${x}</li>`).join('')}</ul></div>
        <div class="action-card"><h4>3 Months</h4><ul>${data.actionPlan["3months"].map(x=>`<li>${x}</li>`).join('')}</ul></div>
        <div class="action-card"><h4>6 Months</h4><ul>${data.actionPlan["6months"].map(x=>`<li>${x}</li>`).join('')}</ul></div>
        <div class="action-card"><h4>1 Year</h4><ul>${data.actionPlan["1year"].map(x=>`<li>${x}</li>`).join('')}</ul></div>
      </div>

      <!-- Action Buttons -->
      <div class="resume-btns" style="margin-top: 30px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="generateAdvancedSimulation()"><i class="fa-solid fa-rotate-right"></i> Resimulate</button>
        <button class="btn btn-green" onclick="saveSimulationData()"><i class="fa-solid fa-floppy-disk"></i> Save Plan</button>
        <button class="btn btn-blue" onclick="downloadSimulation('pdf')"><i class="fa-solid fa-file-pdf"></i> Download PDF</button>
        <button class="btn btn-blue" onclick="downloadSimulation('word')"><i class="fa-solid fa-file-word"></i> Download Word</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function saveSimulationData() {
  if (!currentSimulationData || !currentSimParams) return;
  let saved = JSON.parse(localStorage.getItem("savedSimulations") || "[]");
  saved.push({ date: new Date().toLocaleDateString(), params: currentSimParams, data: currentSimulationData });
  localStorage.setItem("savedSimulations", JSON.stringify(saved));
  trackActivity('Simulation Saved', `Saved ${currentSimulationData.selectedPath} plan`);
  alert("Life Path Simulation saved successfully!");
  renderSavedSimulations();
}

function renderSavedSimulations() {
  const grid = document.getElementById("savedSimsGrid");
  if(!grid) return;
  let saved = JSON.parse(localStorage.getItem("savedSimulations") || "[]");
  if (saved.length === 0) { grid.innerHTML = `<p style="color:var(--muted); font-size: 14px;">No simulations saved yet.</p>`; return; }
  grid.innerHTML = saved.map((sim, idx) => `
    <div class="saved-card" style="border-top: 3px solid var(--purple);">
      <button class="delete-saved-btn" onclick="deleteSavedSimulation(${idx})" title="Delete"><i class="fa-solid fa-xmark"></i></button>
      <div class="saved-card-name">${sim.data.selectedPath} Path</div>
      <div class="saved-card-tag">Goal: ${sim.params.goal} • ${sim.date}</div>
      <div style="font-size: 12px; color: var(--text-secondary);"><strong>Yr 5 Expectation:</strong><br/>${sim.data.simulation.fiveYear.stage}<br/><span style="color:var(--green)">${sim.data.simulation.fiveYear.income}</span></div>
    </div>
  `).join("");
}

function deleteSavedSimulation(index) {
  let saved = JSON.parse(localStorage.getItem("savedSimulations") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedSimulations", JSON.stringify(saved));
  renderSavedSimulations();
}

function downloadSimulation(type) {
  if (!currentSimulationData) return;
  let rawText = type === 'pdf' ? currentSimulationData.download.pdfContent : currentSimulationData.download.wordContent;
  if (!rawText) rawText = "Data could not be formatted properly for download.";

  if (type === 'word') {
    let content = `<html><head><meta charset='utf-8'><title>Life Path Simulation</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6;">`;
    content += `<h1 style="color: #6c3fc5; text-align: center;">Your Selected Path: ${currentSimulationData.selectedPath}</h1><hr/>`;
    content += `<p>${rawText.replace(/\n/g, '<br/>')}</p></body></html>`;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Life_Path_${currentSimulationData.selectedPath.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const lines = doc.splitTextToSize(rawText, 500);
    doc.setFontSize(16); doc.text(`Life Path: ${currentSimulationData.selectedPath}`, 40, 40);
    doc.setFontSize(10); doc.text(lines, 40, 70);
    doc.save(`Life_Path_${currentSimulationData.selectedPath.replace(/\s+/g, '_')}.pdf`);
  }
}

// ==========================================
// 📊 PRO ANALYTICS DASHBOARD ENGINE
// ==========================================

let growthChartInstance = null;
let pathPieChartInstance = null;
let skillChartInstance = null;

function updateLiveDashboard() { 
  try {
    updateAnalyticsDashboard(); 
  } catch (error) {
    console.warn("Live Dashboard background update suppressed:", error);
  }
}

function updateAnalyticsDashboard() {
  let analytics = JSON.parse(localStorage.getItem('appAnalytics')) || { activityLog: [] };
  let savedSims = JSON.parse(localStorage.getItem("savedSimulations") || "[]");
  let savedStartups = JSON.parse(localStorage.getItem("savedStartups") || "[]");
  
  // 1. Calculate Career Readiness Score (Tasks Completed)
  let totalTasks = 0;
  let completedTasks = 0;
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("progress_sub_")) {
       const sub = JSON.parse(localStorage.getItem(key));
       sub.forEach(arr => {
         totalTasks += arr.length;
         completedTasks += arr.filter(Boolean).length;
       });
    }
  });
  let readiness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // 2. Fetch latest AI Simulation Data for KPIs
  let latestSim = savedSims.length > 0 ? savedSims[savedSims.length - 1] : null;
  let recPath = latestSim ? latestSim.data.selectedPath : "--";
  
  // Session Time Tracker
  let start = parseInt(sessionStorage.getItem('appSessionStart')) || Date.now();
  let elapsedMins = Math.floor((Date.now() - start) / 60000);
  
  // Update KPI Cards
  if(document.getElementById('kpi-time')) document.getElementById('kpi-time').innerText = elapsedMins + ' mins';
  if(document.getElementById('kpi-sims')) document.getElementById('kpi-sims').innerText = savedSims.length;
  if(document.getElementById('kpi-tasks')) document.getElementById('kpi-tasks').innerText = completedTasks;
  if(document.getElementById('kpi-path')) document.getElementById('kpi-path').innerText = recPath;
  
  // 3. Update Last Result Snapshot
  const snapshotEl = document.getElementById('live-snapshot-content');
  if (snapshotEl) {
    if (latestSim) {
      snapshotEl.innerHTML = `
        <div style="display:flex; gap:15px; flex-wrap:wrap;">
          <div style="flex:1; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--purple);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Last Selected Path</div>
            <div style="font-size:18px; color:var(--text); font-weight:bold; margin-top:5px;">${latestSim.data.selectedPath}</div>
          </div>
          <div style="flex:1; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--cyan);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Success Probability</div>
            <div style="font-size:18px; color:var(--cyan); font-weight:bold; margin-top:5px;">${latestSim.data.analysis.successProbability}</div>
          </div>
          <div style="flex:2; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--green);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Last Simulation Summary (Yr 5)</div>
            <div style="font-size:14px; color:var(--text-secondary); margin-top:5px;">${latestSim.data.simulation.fiveYear.stage} — <span style="color:var(--green)">${latestSim.data.simulation.fiveYear.income}</span></div>
          </div>
        </div>`;
    } else {
      // Dynamic live placeholder based on overall website usage
      snapshotEl.innerHTML = `
        <div style="display:flex; gap:15px; flex-wrap:wrap;">
          <div style="flex:1; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--purple);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Overall Readiness</div>
            <div style="font-size:18px; color:var(--text); font-weight:bold; margin-top:5px;">${readiness}%</div>
          </div>
          <div style="flex:1; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--cyan);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Tasks Mastered</div>
            <div style="font-size:18px; color:var(--cyan); font-weight:bold; margin-top:5px;">${completedTasks}</div>
          </div>
          <div style="flex:2; background:rgba(0,0,0,0.3); padding:15px; border-radius:8px; border-left:3px solid var(--green);">
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Action Required</div>
            <div style="font-size:14px; color:var(--text-secondary); margin-top:5px;">Run <span style="color:var(--green)">AI Simulator</span> to unlock deeper predictive insights.</div>
          </div>
        </div>`;
    }
  }
  
  // 3. Render Charts
  renderGrowthTrendChart(latestSim, readiness);
  renderPathInclinationChart(savedSims, savedStartups, analytics.activityLog);
  renderSkillDistributionChart(latestSim, readiness);
  
  // 4. Generate Insights & Recommendations
  generateDynamicInsights(readiness, latestSim, savedSims.length);
  
  // 5. Render Activity Log
  renderActivityLog(analytics.activityLog);
}

function extractIncome(incomeStr) {
  const match = incomeStr.match(/₹([0-9.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function renderGrowthTrendChart(latestSim, readiness) {
  const ctx = document.getElementById('growthChart').getContext('2d');
  let dataPoints = [0, 0, 0];
  
  if (latestSim) {
    dataPoints = [
      extractIncome(latestSim.data.simulation.oneYear.income),
      extractIncome(latestSim.data.simulation.threeYear.income),
      extractIncome(latestSim.data.simulation.fiveYear.income)
    ];
  } else if (readiness > 0) {
    // Dynamically project growth based purely on roadmap task completion usage
    let base = 3 + (readiness / 15);
    dataPoints = [parseFloat(base.toFixed(1)), parseFloat((base * 1.5).toFixed(1)), parseFloat((base * 2.5).toFixed(1))];
  }

  if (growthChartInstance) {
    growthChartInstance.data.datasets[0].data = dataPoints;
    growthChartInstance.update('none'); // Update without flickering
  } else {
    growthChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Year 1', 'Year 3', 'Year 5'],
        datasets: [{
          label: 'Projected Income (Lakhs ₹/yr)',
          data: dataPoints,
          borderColor: '#00e5ff',
          backgroundColor: 'rgba(0, 229, 255, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#00ffb3',
          pointBorderColor: '#020810',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8ba4c0' } },
          x: { grid: { display: false }, ticks: { color: '#8ba4c0' } }
        },
        plugins: { legend: { labels: { color: '#e2eeff', font: { family: 'Inter' } } } }
      }
    });
  }
}

function renderPathInclinationChart(savedSims, savedStartups, activityLog) {
  const ctx = document.getElementById('pathPieChart').getContext('2d');
  
  // Connect UI Options usage directly to the path inclination chart
  let business = savedStartups.length * 2; 
  let corporate = activityLog.filter(a => a.action === 'Generated Resume').length * 2;
  let studies = activityLog.filter(a => a.action === 'Career Test Completed').length * 2;
  
  savedSims.forEach(sim => { 
    if(sim.data.selectedPath === 'Business') business += 3;
    else if(sim.data.selectedPath === 'Corporate Job') corporate += 3;
    else if(sim.data.selectedPath === 'Higher Studies') studies += 3;
  });
  
  let dataVals = [business, corporate, studies];
  if(business === 0 && corporate === 0 && studies === 0) dataVals = [1, 1, 1]; // Fallback empty state

  if (pathPieChartInstance) {
    pathPieChartInstance.data.labels = ['Business', 'Corporate Job', 'Higher Studies'];
    pathPieChartInstance.data.datasets[0].data = dataVals;
    pathPieChartInstance.update('none');
  } else {
    pathPieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Business', 'Corporate Job', 'Higher Studies'],
        datasets: [{
          data: dataVals,
          backgroundColor: ['#ff9500', '#00aaff', '#bf5af2'],
          borderColor: '#0b1526',
          borderWidth: 3,
          hoverOffset: 5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#e2eeff', padding: 20, font: { family: 'Inter' } } } },
        cutout: '70%'
      }
    });
  }
}

function renderSkillDistributionChart(latestSim, readiness) {
  const ctx = document.getElementById('skillRadarChart').getContext('2d');
  let tech = 0, soft = 0, core = 0;
  
  if (latestSim) {
    const skills = latestSim.params.skills.toLowerCase();
    const techWords = ['python','java','html','css','js','react','node','sql','aws','cloud','data','ai','ml','tech','code'];
    const softWords = ['lead','manage','comm','speak','write','team','agile','scrum','market','sale','design'];
    let techBoost = 0, softBoost = 0;
    techWords.forEach(w => { if(skills.includes(w)) techBoost += 25; });
    softWords.forEach(w => { if(skills.includes(w)) softBoost += 25; });
    
    tech = Math.min(100, Math.max(30, 40 + techBoost + (readiness * 0.5)));
    soft = Math.min(100, Math.max(30, 40 + softBoost + (readiness * 0.5)));
    core = Math.min(100, Math.max(30, 40 + (readiness * 0.8)));
  } else { 
    // Dynamically increase skill strength solely based on ticking roadmap tasks
    tech = Math.min(100, 40 + readiness);
    soft = Math.min(100, 40 + (readiness * 0.6));
    core = Math.min(100, 40 + (readiness * 0.8));
  }

  if (skillChartInstance) {
    skillChartInstance.data.datasets[0].data = [tech, soft, core];
    skillChartInstance.update('none');
  } else {
    skillChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Tech & Dev', 'Soft & Lead', 'Core Domain'],
        datasets: [{
          data: [tech, soft, core],
          backgroundColor: ['#00e5ff', '#ff3366', '#ffd600'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8ba4c0' } },
          x: { grid: { display: false }, ticks: { color: '#8ba4c0' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function generateDynamicInsights(readiness, latestSim, simCount) {
  const list = document.getElementById('ai-insights-list');
  let insights = [];
  
  if (readiness > 75) insights.push(`<div class="insight-item"><i class="fa-solid fa-check-circle" style="color:var(--green)"></i> Excellent metric! You are ${readiness}% through your roadmap tracking, showing high consistency.</div>`);
  else if (readiness > 30) insights.push(`<div class="insight-item"><i class="fa-solid fa-arrow-up-right-dots" style="color:var(--blue)"></i> Steady progress at ${readiness}% roadmap completion. Focus on the advanced technical nodes next.</div>`);
  else insights.push(`<div class="insight-item"><i class="fa-solid fa-triangle-exclamation" style="color:var(--orange)"></i> Roadmap completion is low (${readiness}%). To improve predictability, start checking off your learning nodes.</div>`);
  
  if (latestSim) {
    const prob = parseInt(latestSim.data.analysis.successProbability);
    if (prob > 70) insights.push(`<div class="insight-item"><i class="fa-solid fa-bolt" style="color:var(--yellow)"></i> The ${latestSim.data.selectedPath} trajectory shows a highly viable ${prob}% success probability given your current input profile.</div>`);
    else insights.push(`<div class="insight-item"><i class="fa-solid fa-scale-balanced" style="color:var(--cyan)"></i> The ${latestSim.data.selectedPath} trajectory shows a moderate ${prob}% probability. Skill expansion recommended.</div>`);
    
    if (latestSim.data.analysis.riskLevel === "High") insights.push(`<div class="insight-item"><i class="fa-solid fa-fire" style="color:var(--red)"></i> High risk tolerance mapped. Make sure to establish a 6-month financial runway before massive pivots.</div>`);
  } else {
    insights.push(`<div class="insight-item"><i class="fa-solid fa-brain" style="color:var(--purple)"></i> Action required: Run the AI Life Simulator to populate deep predictive analytics.</div>`);
  }
  
  if (simCount > 3) insights.push(`<div class="insight-item"><i class="fa-solid fa-magnifying-glass-chart" style="color:var(--text)"></i> You've run ${simCount} simulations. Based on permutations, you are actively analyzing your options.</div>`);

  list.innerHTML = insights.join('');
}

function renderActivityLog(log) {
  const container = document.getElementById('activity-log');
  if (!log || log.length === 0) {
    container.innerHTML = '<div style="color:var(--muted); font-size:13px; text-align:center; padding: 20px;">No recent system activity logged.</div>';
    return;
  }
  
  let html = '';
  log.slice(0, 10).forEach(item => {
    const date = new Date(item.time).toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    let icon = "fa-solid fa-bolt";
    let color = "var(--blue)";
    
    if (item.action.includes('Task')) { icon = "fa-solid fa-list-check"; color = "var(--green)"; }
    else if (item.action.includes('Simulation')) { icon = "fa-solid fa-brain"; color = "var(--purple)"; }
    else if (item.action.includes('Test')) { icon = "fa-solid fa-clipboard-user"; color = "var(--orange)"; }
    else if (item.action.includes('Startup')) { icon = "fa-solid fa-rocket"; color = "var(--cyan)"; }
    
    html += `
      <div class="activity-item">
        <div class="act-icon" style="color: ${color}; background: ${color}22;"><i class="${icon}"></i></div>
        <div class="act-content">
          <div class="act-title">${item.action}</div>
          <div class="act-desc">${item.detail}</div>
        </div>
        <div class="act-time">${date}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}
