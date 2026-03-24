function showSection(id){
  document.querySelectorAll("section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
  document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+id).classList.add("active");
  if(id==="jobs") renderChart();
  if(id==="mentor" && chatHistory.length === 0) initChatSuggestions();
}

const roadmaps={
// ===== UPGRADED 28-ITEM ROADMAP (7 per year) =====
"Web Developer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Learn HTML, CSS, JavaScript basics","Learn Git and GitHub","Build simple static websites"],2:["Advanced JavaScript (ES6+)","Learn React.js","Build responsive web projects"],3:["Learn Node.js & Express.js","Learn MongoDB / MySQL","Build full-stack web applications"],4:["Build large full-stack project","Deploy on cloud","Prepare for web developer interviews"]},
"Frontend Developer":{free:"https://www.w3schools.com",paid:"https://www.udemy.com",1:["Learn HTML and CSS","Learn JavaScript basics","Build simple UI pages"],2:["Learn React.js or Angular","Learn responsive design","Build frontend projects"],3:["Learn advanced frontend tools","Work with REST APIs","Build real-world UI applications"],4:["Create strong portfolio","Optimise UI performance","Apply for frontend jobs"]},
"Backend Developer":{free:"https://www.freecodecamp.org",paid:"https://www.udemy.com",1:["Learn Python or Java basics","Understand programming fundamentals"],2:["Learn backend frameworks (Node.js/Django)","Learn SQL databases","Build backend APIs"],3:["Learn authentication and security","Build scalable backend systems","Work with microservices"],4:["Learn system design","Build production backend project","Apply for backend roles"]},
"Full Stack Developer":{free:"https://www.theodinproject.com",paid:"https://www.udemy.com",
1:[
  {title:"HTML & CSS Foundations",domain:"Frontend",desc:"Learn semantic HTML5, CSS3 layouts, flexbox, grid and responsive design principles.",tools:["VS Code","HTML5","CSS3","Chrome DevTools"],outcome:"Build a fully responsive personal webpage"},
  {title:"JavaScript Essentials",domain:"Frontend",desc:"Master variables, functions, DOM manipulation, events and ES6+ features.",tools:["VS Code","JavaScript","Browser Console"],outcome:"Build interactive UI components"},
  {title:"Python Programming Basics",domain:"Backend",desc:"Learn Python syntax, OOP concepts, file handling and basic algorithms.",tools:["VS Code","Python 3","pip"],outcome:"Write clean reusable Python scripts"},
  {title:"SQL & Database Basics",domain:"Database",desc:"Understand relational databases, write SQL queries, joins and basic schema design.",tools:["MySQL","DB Browser","VS Code"],outcome:"Design and query a student database"},
  {title:"Git & GitHub Basics",domain:"DevOps",desc:"Learn version control, branching, commits, pull requests and GitHub workflows.",tools:["Git","GitHub","VS Code"],outcome:"Manage code with version control"},
  {title:"Personal Portfolio Website",domain:"Projects",desc:"Design and deploy a personal portfolio showcasing skills, projects and contact info.",tools:["HTML","CSS","JavaScript","GitHub Pages"],outcome:"Live deployed portfolio website"},
  {title:"Student CRUD App",domain:"Projects",desc:"Build a student management app with add, edit, delete and search functionality.",tools:["HTML","CSS","JavaScript","MySQL"],outcome:"Working full CRUD application"}
],
2:[
  {title:"React.js Framework",domain:"Frontend",desc:"Learn React components, props, state, hooks, routing and reusable UI patterns.",tools:["React","npm","VS Code","React Router"],outcome:"Build a dynamic single-page application"},
  {title:"Node.js & Express APIs",domain:"Backend",desc:"Build RESTful APIs with Express, handle routes, middleware and HTTP methods.",tools:["Node.js","Express","Postman","VS Code"],outcome:"Working REST API with full CRUD"},
  {title:"MongoDB & Mongoose",domain:"Database",desc:"Learn NoSQL database design, schema modeling and connect MongoDB with Node.js.",tools:["MongoDB Atlas","Mongoose","Compass"],outcome:"Database-connected backend API"},
  {title:"Responsive UI with Tailwind",domain:"Frontend",desc:"Build mobile-first responsive interfaces using Tailwind CSS utility classes.",tools:["Tailwind CSS","React","VS Code"],outcome:"Pixel-perfect responsive UI"},
  {title:"AWS Cloud Fundamentals",domain:"Cloud",desc:"Understand cloud computing, AWS core services: EC2, S3, IAM and billing basics.",tools:["AWS Console","AWS CLI","IAM"],outcome:"Deploy a static site on AWS S3"},
  {title:"Blog Web Application",domain:"Projects",desc:"Full stack blog with React frontend, Node/Express backend and MongoDB database.",tools:["React","Node.js","MongoDB","GitHub"],outcome:"Deployed full stack blog app"},
  {title:"E-Commerce REST API",domain:"Projects",desc:"Build product, cart and order APIs with JWT authentication and role-based access.",tools:["Node.js","Express","MongoDB","Postman","JWT"],outcome:"Secure production-ready REST API"}
],
3:[
  {title:"Advanced React Patterns",domain:"Frontend",desc:"Master Redux, Context API, lazy loading, code splitting and performance optimization.",tools:["React","Redux","React Query","VS Code"],outcome:"High-performance optimized React app"},
  {title:"Authentication & Security",domain:"Backend",desc:"Implement JWT, bcrypt password hashing, OAuth2 and role-based access control.",tools:["Node.js","JWT","bcrypt","Passport.js"],outcome:"Fully secured authentication system"},
  {title:"MySQL Advanced & Redis Cache",domain:"Database",desc:"Learn indexing, stored procedures, query optimization and Redis caching strategies.",tools:["MySQL","Redis","DBeaver"],outcome:"Optimized high-performance database"},
  {title:"Docker & Containerization",domain:"DevOps",desc:"Containerize frontend and backend apps, write Dockerfiles and use Docker Compose.",tools:["Docker","Docker Compose","VS Code"],outcome:"Fully dockerized full stack app"},
  {title:"AWS EC2 & Deployment",domain:"Cloud",desc:"Deploy Node.js apps on EC2, configure security groups, Nginx reverse proxy and SSL.",tools:["AWS EC2","Nginx","PM2","Let's Encrypt"],outcome:"Live app running on AWS cloud"},
  {title:"Real-Time Chat Application",domain:"Projects",desc:"Build a real-time chat app using WebSockets with rooms, typing indicators and history.",tools:["Socket.io","React","Node.js","MongoDB"],outcome:"Live real-time chat application"},
  {title:"Job Portal Platform",domain:"Projects",desc:"Full stack job listing platform with auth, search filters, apply and admin dashboard.",tools:["React","Node.js","MongoDB","AWS S3","JWT"],outcome:"Deployed job portal with admin panel"}
],
4:[
  {title:"Next.js & Server-Side Rendering",domain:"Frontend",desc:"Build SEO-optimized apps with SSR, SSG, API routes and image optimization in Next.js.",tools:["Next.js","React","Vercel","TypeScript"],outcome:"Production-ready SSR web application"},
  {title:"Microservices Architecture",domain:"Backend",desc:"Decompose monolith into microservices with API Gateway, service discovery and messaging.",tools:["Node.js","Docker","Nginx","RabbitMQ"],outcome:"Scalable microservices backend system"},
  {title:"CI/CD Pipelines",domain:"DevOps",desc:"Automate testing, building and deployment pipelines triggered on every GitHub push.",tools:["GitHub Actions","AWS CodePipeline","Docker"],outcome:"Fully automated deploy pipeline"},
  {title:"AWS Advanced: Lambda & RDS",domain:"Cloud",desc:"Build serverless functions with Lambda, use RDS for production databases and CloudFront CDN.",tools:["AWS Lambda","AWS RDS","CloudFront","Route53"],outcome:"Serverless production-grade app"},
  {title:"AI-Assisted Development",domain:"AI Tools",desc:"Use Amazon Q Developer to generate boilerplate, review code, fix bugs and suggest improvements.",tools:["Amazon Q","VS Code","AWS","GitHub Copilot"],outcome:"2x faster AI-assisted dev workflow"},
  {title:"SaaS Dashboard Platform",domain:"Projects",desc:"Build a multi-tenant SaaS app with subscription billing, analytics dashboard and role management.",tools:["Next.js","Node.js","AWS","Stripe API","MongoDB"],outcome:"Live monetized SaaS product"},
  {title:"AI-Powered Career Platform",domain:"Projects",desc:"Full stack platform with AI job recommendations, resume builder, skill gap analysis and deployment.",tools:["React","Node.js","MongoDB","Amazon Q","AWS EC2","Docker"],outcome:"Complete deployed AI career platform"}
]},
"Mobile App Developer (Android)":{free:"https://developer.android.com/courses",paid:"https://www.udemy.com",1:["Learn Java or Kotlin","Learn programming basics"],2:["Learn Android Studio","Build simple mobile apps"],3:["Learn APIs and databases","Build advanced Android apps"],4:["Publish app on Play Store","Apply for Android developer jobs"]},
"Mobile App Developer (iOS)":{free:"https://www.hackingwithswift.com",paid:"https://www.udemy.com",1:["Learn Swift programming","Learn programming basics"],2:["Learn Xcode","Build basic iOS apps"],3:["Work with APIs and databases","Build real-world iOS apps"],4:["Publish apps in App Store","Prepare for iOS developer roles"]},
"Game Developer":{free:"https://learn.unity.com",paid:"https://www.gamedev.tv",1:["Learn programming basics (C# or C++)","Learn game design fundamentals"],2:["Learn Unity or Unreal Engine","Build small games"],3:["Learn 3D graphics and physics","Develop advanced games"],4:["Build complete game project","Publish game portfolio"]},
"Software Developer":{free:"https://www.freecodecamp.org",paid:"https://www.coursera.org",1:["Learn C / Python","Learn programming fundamentals"],2:["Learn data structures","Build basic software projects"],3:["Learn system design","Work on real-world software"],4:["Prepare coding interviews","Apply for software developer jobs"]},
"Data Scientist":{free:"https://www.kaggle.com/learn",paid:"https://www.datacamp.com",1:["Learn Python","Learn statistics and math"],2:["Learn NumPy and Pandas","Perform data analysis"],3:["Learn machine learning","Work on Kaggle projects"],4:["Build ML models","Create strong data science portfolio"]},
"Data Analyst":{free:"https://www.google.com/analytics/learn",paid:"https://www.coursera.org",1:["Learn Excel","Learn statistics basics"],2:["Learn SQL","Learn Power BI / Tableau"],3:["Analyse datasets","Build analytics dashboards"],4:["Build data portfolio","Apply for data analyst jobs"]},
"Machine Learning Engineer":{free:"https://fast.ai",paid:"https://www.coursera.org",1:["Learn Python","Learn math for ML"],2:["Learn ML algorithms","Build small ML projects"],3:["Learn TensorFlow or PyTorch","Develop ML applications"],4:["Deploy ML models","Prepare ML interviews"]},
"Artificial Intelligence Engineer":{free:"https://www.elementsofai.com",paid:"https://www.udacity.com",1:["Learn Python","Learn math and statistics"],2:["Learn ML basics","Learn AI algorithms"],3:["Learn deep learning","Build AI applications"],4:["Deploy AI systems","Apply for AI engineer roles"]},
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

const domainSelect = document.getElementById("domain");
Object.keys(roadmaps).forEach(d => {
  let option=document.createElement("option");
  option.value=d; option.text=d;
  domainSelect.appendChild(option);
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

function generateRoadmap(){
  const domain = document.getElementById("domain").value;
  const year = parseInt(document.getElementById("year").value);
  let output=`<div class="domain-label"><i class="fa-solid fa-map"></i> &nbsp;${domain}</div>`;

  if(roadmaps[domain].free || roadmaps[domain].paid){
    output+=`<div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 24px;">`;
    if(roadmaps[domain].free) output+=`<a href="${roadmaps[domain].free}" target="_blank" class="btn btn-green" style="text-decoration:none;"><i class="fa-solid fa-graduation-cap"></i> &nbsp;Free Platform</a>`;
    if(roadmaps[domain].paid) output+=`<a href="${roadmaps[domain].paid}" target="_blank" class="btn btn-blue" style="text-decoration:none;"><i class="fa-solid fa-credit-card"></i> &nbsp;Paid Platform</a>`;
    output+=`</div>`;
  }

  for(let y=year; y<=4; y++){
    const items=roadmaps[domain][y];
    const checked=getProgress(domain,y);
    const total=Array.isArray(items)?items.length:0;
    const done=checked.filter(Boolean).length;
    const pct=total>0?Math.round((done/total)*100):0;

    output+=`
    <div class="year-header">
      <div class="year-title">
        <i class="fa-solid fa-calendar-days" style="color:var(--blue);"></i>
        Year ${y}
        <span class="year-badge">${yearLabels[y-1]}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="year-progress-label" id="pct-label-${y}">${pct}%</span>
        <span id="done-label-${y}" style="font-size:11px;color:var(--muted);">${done}/${total} done</span>
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
          <div class="roadmap-card ${isDone?'completed':''}" id="card-${y}-${i}" style="border-left:4px solid ${color};">
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <input type="checkbox" class="item-checkbox" ${isDone?'checked':''}
                onchange="toggleItem('${domain}',${y},${i},this)" onclick="event.stopPropagation()">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <span class="domain-badge" style="background:${color}22;color:${color};border:1px solid ${color}44;">
                      <i class="${icon}"></i> ${item.domain}
                    </span>
                    <strong class="card-title" style="font-size:15px;color:var(--text);font-weight:600;">${i+1}. ${item.title}</strong>
                  </div>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);margin:0 0 12px;line-height:1.6;">${item.desc}</p>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                  ${item.tools.map(t=>`<span class="tool-chip"><i class="fa-solid fa-wrench" style="font-size:9px;"></i> ${t}</span>`).join('')}
                </div>
                <div style="font-size:12px;color:${color};display:flex;align-items:center;gap:6px;">
                  <i class="fa-solid fa-circle-check"></i> ${item.outcome}
                </div>
              </div>
            </div>
          </div>`;
        } else {
          const isDone=checked[i]||false;
          output+=`
          <div class="roadmap-card ${isDone?'completed':''}" id="card-${y}-${i}" style="border-left:4px solid var(--green);">
            <div style="display:flex;align-items:center;gap:14px;">
              <input type="checkbox" class="item-checkbox" ${isDone?'checked':''}
                onchange="toggleItem('${domain}',${y},${i},this)" onclick="event.stopPropagation()">
              <span class="card-title" style="font-size:14px;">${item}</span>
            </div>
          </div>`;
        }
      });
    }
    output+=`</div>`;
  }
  document.getElementById("roadmapOutput").innerHTML = output;
}

function toggleItem(domain, year, idx, el){
  const items=roadmaps[domain][year];
  const total=Array.isArray(items)?items.length:0;
  let checked=getProgress(domain,year);
  if(checked.length<total) checked=Array(total).fill(false);
  checked[idx]=el.checked;
  saveProgress(domain,year,checked);
  const card=document.getElementById(`card-${year}-${idx}`);
  if(card) card.classList.toggle('completed',el.checked);
  const done=checked.filter(Boolean).length;
  const pct=total>0?Math.round((done/total)*100):0;
  const bar=document.getElementById(`prog-${year}`);
  if(bar) bar.style.width=pct+'%';
  const lbl=document.getElementById(`pct-label-${year}`);
  if(lbl) lbl.textContent=pct+'%';
  const sub=document.getElementById(`done-label-${year}`);
  if(sub) sub.textContent=`${done}/${total} done`;
}

function downloadRoadmap() {
  const domain = document.getElementById("domain").value;
  if (!roadmaps[domain]) {
    alert("Please select a domain to download.");
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

  for (let y = 1; y <= 4; y++) {
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

function startTest(){
  index=0;
  Object.keys(roadmaps).forEach(d=>score[d]=0);
  showQuestion();
}

function showQuestion(){
  if(index>=questions.length){showResult();return;}
  let q=questions[index];
  let progress = Math.round((index/questions.length)*100);
  document.getElementById("questionBox").innerHTML=`
    <div class="q-meta">QUESTION ${index+1} OF ${questions.length}</div>
    <div class="progress-wrap"><div class="progress-bar" style="width:${progress}%"></div></div>
    <p>${q.q}</p>
    <div class="q-btns">
      <button class="q-yes" onclick="answer(true)">Yes</button>
      <button class="q-no" onclick="answer(false)">No</button>
    </div>`;
}

function answer(ans){
  if(ans){score[questions[index].domain]++;}
  index++; 
  showQuestion();
}

function showResult(){
  let best=Object.keys(score).reduce((a,b)=>score[a]>score[b]?a:b);
  document.getElementById("questionBox").innerHTML=`
    <div class="q-result-label">RECOMMENDED CAREER</div>
    <div class="q-result-val">${best}</div>
    <p style="color:var(--muted);font-size:15px;">Based on your responses, this career path matches your interests!</p>
    <button class="btn btn-green" onclick="startTest()">Retake Test</button>`;
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
  "how can students get a high paying job in it": "Students can get a high paying job in IT by **learning advanced skills**, **building strong projects**, and **practicing coding regularly**."
};

const chatSuggestions = [
  "How do I start in Web Development?",
  "What are the best projects for AI?",
  "Give me a roadmap for Cyber Security",
  "How to prepare for a Coding Interview?"
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
    // Small delay to make it feel natural
    await new Promise(r => setTimeout(r, 800));
  } else {
    try {
      // 🛑 PASTE YOUR GEMINI API KEY BELOW 🛑
      // Replace 'YOUR_GEMINI_API_KEY' with the actual key you generated!
      const API_KEY = "YOUR_GEMINI_API_KEY"; 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: "You are a professional, friendly, and world-class career mentor. Chat with the user like a real human. Be empathetic, insightful, and help them solve specific career problems. Use a conversational tone, keep explanations clear, and provide actionable advice." }] },
          contents: chatHistory
        })
      });

      const data = await response.json();
      answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response right now.";
    } catch (error) {
      answer = "Connection error. Please check your API key.";
      console.error("AI Mentor Error:", error);
    }
  }

    // Add AI response to history
    chatHistory.push({ role: "model", parts: [{ text: answer }] });

    // 3. Replace loading text with actual AI answer
    const formattedAnswer = answer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Handle bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')         // Handle italics
      .replace(/\n/g, '<br>');                       // Handle newlines
      
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

function downloadResume(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const getVal = (id) => document.getElementById(id).value.trim();

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
    if (getVal('skills')) { drawSectionTitle('Technical Skills'); drawBodyText(getVal('skills')); }

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

let chartInstance = null;
let hardwareChartInstance = null;
function renderChart(){
  if(!chartInstance) {
    const ctx=document.getElementById("jobChart").getContext("2d");
    chartInstance = new Chart(ctx,{
      type:'bar',
      data:{
        labels:Object.keys(roadmaps).slice(0,10),
        datasets:[{
          label:'Software Job Demand',
          data:[90, 82, 75, 85, 70, 65, 60, 78, 88, 92],
          backgroundColor:[
            '#00aaff', 
            'rgb(143, 255, 30)', 
            '#4682b4', 
            '#20b2aa', 
            'rgb(72, 209, 86)', 
            '#00ced1', 
            '#5f9ea0', 
            '#87ceeb', 
            'rgb(237, 189, 100)',
            'rgb(255, 0, 187)'
          ]
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const label = chartInstance.data.labels[index];
            showSection('roadmap');
            document.getElementById("domain").value = label;
            generateRoadmap();
          }
        },
        scales:{
          y:{
            beginAtZero:true,
            max:100,
            ticks:{color:'#c8dff5'},
            grid:{color:'rgba(0,170,255,0.1)'}
          },
          x:{
            ticks:{color:'#c8dff5',font:{size:10}},
            grid:{display:false}
          }
        },
        plugins:{
          legend:{labels:{color:'#c8dff5'}},
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Score: ${context.parsed.y}`;
              }
            }
          }
        }
      }
    });
  }

  if(!hardwareChartInstance) {
    const ctx2=document.getElementById("hardwareChart").getContext("2d");
    hardwareChartInstance = new Chart(ctx2,{
      type:'bar',
      data:{
        labels:["IoT Developer", "Robotics Eng", "Embedded Sys", "Network Eng", "Automation Eng", "VLSI Engineer"],
        datasets:[{
          label:'Hardware Job Demand',
          data:[82, 88, 85, 72, 80, 90],
          backgroundColor:[
            '#ff4081',
            '#ff80ab',
            'hsl(80, 83%, 66%)',
            '#ba68c8',
            'rgb(30, 233, 186)',
            'rgb(27, 81, 216)'
          ]
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            let label = hardwareChartInstance.data.labels[index];
            const map = {
              "Robotics Eng": "Robotics Engineer",
              "Embedded Sys": "Embedded Systems Developer",
              "Network Eng": "Network Engineer",
              "Automation Eng": "Automation Engineer"
            };
            if(map[label]) label = map[label];
            if(roadmaps[label]){
              showSection('roadmap');
              document.getElementById("domain").value = label;
              generateRoadmap();
            }
          }
        },
        scales:{
          y:{
            beginAtZero:true, max:100, ticks:{color:'#c8dff5'}, grid:{color:'rgba(255,64,129,0.1)'}
          },
          x:{
            ticks:{color:'#c8dff5',font:{size:10}}, grid:{display:false}
          }
        },
        plugins:{
          legend:{labels:{color:'#c8dff5'}},
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Score: ${context.parsed.y}`;
              }
            }
          }
        }
      }
    });
  }
}

window.onload=function(){
  showSection("roadmap");
}
