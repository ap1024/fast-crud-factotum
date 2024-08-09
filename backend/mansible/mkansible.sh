#!/bin/bash


# 创建env目录及其子目录
mkdir -p ./env/envvars
mkdir -p ./env/extravars
mkdir -p ./env/passwords
mkdir -p ./env/settings

# 创建inventory目录及其子目录
mkdir -p ./inventory
mkdir -p ./inventory/group_vars

# 创建project目录及其子目录
mkdir -p ./project
mkdir -p ./project/roles

# 创建stdout目录
mkdir -p ./stdout

# 创建.runner目录
mkdir -p ./.runner

# 创建示例hosts文件
cat <<EOL > ./inventory/hosts
[webservers]
webserver1 ansible_host=192.168.1.10 ansible_user=your_user

[databases]
dbserver1 ansible_host=192.168.1.20 ansible_user=your_user
EOL

# 创建示例playbook文件
cat <<EOL > ./project/my_playbook.yml
---
- name: Ensure web servers are up to date
  hosts: webservers
  tasks:
    - name: Update apt repository cache and install nginx
      apt:
        update_cache: yes
        name: nginx
        state: latest
EOL

echo "Ansible Runner project directory structure created successfully."
