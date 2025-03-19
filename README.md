# app_config.yml
To use the `app_config.yml` file, follow these steps:

1. Locate the `app_config.yml` file in the root directory of your project.
2. Open the file using a text editor of your choice.
3. Modify the configuration settings according to your requirements.  
    - **promotion**: promotion_name 
    - **node_version**: node version to use while building 
        * default '18'
    - **module_source**: npm or bit  
        * npm  

                always-auth=true  
                //registry.npmjs.org/:_authToken=<token>
        * bit
        
                always-auth=true  
                @teambit:registry=https://node-registry.bit.cloud  
                @tmsw:registry=https://node-registry.bit.cloud  
                //node-registry.bit.cloud/:_authToken=<token>  

    - **locale_default**: en-US  
    - **source_folder**:  
        * default '.'  
        * if your package.json is in a subfolder specify it here  
    - **build_folder**: folder where build output files go that need to be deployed
        * default 'build'
        * if your node build script outputs files to a different location specify it here
    - **build_app**:  
        * default: false  
        * set to true when you have made your config modifications and are ready for the pipeline to attempt a build  
4. Save the changes to the `app_config.yml` file.

# package.json
To use the `package.json` file, follow these steps:

1. Locate the `package.json` file in the root directory of your project.
2. Open the file using a text editor of your choice.
3. The `package.json` file is primarily used to manage dependencies and scripts for your project. You can add or remove dependencies by modifying the `"dependencies"` section, and define custom scripts in the `"scripts"` section.
4. Make the necessary changes to the `package.json` file.
5. For the build and deploy pipeline to function you need at least these scripts defined. Examples are in the provided package.json  
    - "build:development":  
    - "build:production":
6. Save the changes to the `package.json` file.

