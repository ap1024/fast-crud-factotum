import ansible_runner

def run_playbook_with_limit(private_data_dir, playbook_path, inventory_file, limit_hosts):
    """
    执行指定的 playbook 并限制到特定的主机。

    :param private_data_dir: 包含 ansible 相关文件的目录
    :param playbook_path: 要执行的 playbook 路径
    :param inventory_file: inventory 文件的路径
    :param limit_hosts: 要限制的主机，可以是逗号分隔的主机名字符串
    :return: ansible_runner.run 的结果
    """
    r = ansible_runner.run(
        private_data_dir=private_data_dir,
        playbook=playbook_path,
        inventory=inventory_file,
        limit=limit_hosts,
        become=True,
        become_user="root",
        # limit={'hosts': limit_hosts.split(',')}
    )
    return r

# 示例调用
private_data_dir = '/root/wuli/djangoProject/mansible/'
playbook_path = '/root/wuli/djangoProject/mansible/project/test.yml'
inventory_file = '/root/wuli/djangoProject/mansible/inventory/hosts'
limit_hosts = '8.130.45.15,192.210.161.202'  # 指定要执行 playbook 的主机
print(limit_hosts)
result = run_playbook_with_limit(private_data_dir, playbook_path, inventory_file, limit_hosts)

# 打印结果
print(result.rc)  # 返回代码
print(result.status)  # 状态
for event in result.events:
    print(event['stdout'])  # 输出事件日志

