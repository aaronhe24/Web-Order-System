# Web-Order-System
A web order system for food delivery!


#The main steps of project code pull and local development

###Official domain https://orders.facedrive-foods.com





#Code structure brief summary

###1. All project code files are located inside the src folder

###2. The project root file index.html is located inside the /public folder

###3. Image resources are located in the /src/assets folder

###4. The font is located in the /src/i18n folder

###5. All apis are located in the /src/api folder

###6. Enumerations and various data types are located in the /src/module folder

###7. The route is located in the /src/router folder

###8. The store file of vuex is located in the /src/store folder (currently we only use vuex for switching languages)

###9. The UI view layer (each routing page) is located in the /src/view file

###10. UI view components are located in the /src/components folder

###11. The common components of the UI view are located in the /src/components/baseComponents folder

###12. The logic layer files are located in the /src/logic folder

###13. The font is located in the /src/fonts folder

###14. Common settings (global css, tools, cache, helper functions, etc.) are located in the /src/common folder, and the global css configuration file is globalStyle.css

###15. Because the project uses TypeScript, the content received by all interfaces must first be converted into objects (or interfaces) for processing, and placed in /src/module for instantiation



### This project is layered as api layer -> data layer -> logic layer -> view layer

```
1. The api layer is mainly composed of apihelper.ts and api.ts files, and is mainly responsible for API request.
2. The data layer stores various data types and enumerations. Please define the data as a suitable interface or class and place it in the module folder to connect to the api
3. The logic layer is uniformly placed in /src/logic, mainly for business logic and data processing related to business logic
4. The view layer is responsible for UI interaction processing without complex business processing judgments, and directly connects with the logic layer
5. The view compoment level is only for interactive processing of the UI layer, we do not recommended to connect the logic layer directly
```








​              
