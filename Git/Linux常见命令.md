# Linux 常用命令

### ls — List

ls 会列举出当前工作目录的内容（文件或文件夹）。

### mkdir — Make Directory

mkdir 用于新建一个新目录

### pwd — Print Working Directory

显示当前工作目录

### cd — Change Directory

切换文件路径，cd 将给定的文件夹（或目录）设置成当前工作目录。

### rmdir— Remove Directory

删除给定的目录。

### rm— Remove

rm 会删除给定的文件

### cp— Copy

cp 命令对文件进行复制

### mv— Move

mv 命令对文件或文件夹进行移动，如果文件或文件夹存在于当前工作目录，还可以对文件或文件夹进行重命名。

### cat— concatenate and print files

cat 用于在标准输出（监控器或屏幕）上查看文件内容

### tail — print TAIL(from last)

ail 默认在标准输出上显示给定文件的最后 10 行内容，可以使用 tail -n N 指定在标准输出上显示文件的最后 N 行内容。

### less — print LESS

less 按页或按窗口打印文件内容。在查看包含大量文本数据的大文件时是非常有用和高效的。你可以使用 Ctrl+F 向前翻页，Ctrl+B 向后翻页。

### grep

grep 在给定的文件中搜寻指定的字符串。grep -i “” 在搜寻时会忽略字符串的大小写，而 grep -r “” 则会在当前工作目录的文件中递归搜寻指定的字符串。

### find

这个命令会在给定位置搜寻与条件匹配的文件。你可以使用 find -name 的-name 选项来进行区分大小写的搜寻，find -iname 来进行不区分大小写的搜寻。

### tar

tar 命令能创建、查看和提取 tar 压缩文件。tar -cvf 是创建对应压缩文件，tar -tvf 来查看对应压缩文件，tar -xvf 来提取对应压缩文件。

### zip

gzip 命令创建和提取 gzip 压缩文件，还可以用 gzip -d 来提取压缩文件。

### unzip

unzip 对 gzip 文档进行解压。在解压之前，可以使用 unzip -l 命令查看文件内容。

### help

help 会在终端列出所有可用的命令,可以使用任何命令的-h 或-help 选项来查看该命令的具体用法。图就省略啦，会有详细列表显示出来的。

### whatis — What is this command

whatis 会用单行来描述给定的命令，就是解释当前命令。

### exit

exit 用于结束当前的终端会话。

### ping

ping 通过发送数据包 ping 远程主机(服务器)，常用与检测网络连接和服务器状态。

### who — Who Is logged in

who 能列出当前登录的用户名。

### su — Switch User

su 用于切换不同的用户。即使没有使用密码，超级用户也能切换到其它用户。

### uname

uname 会显示出关于系统的重要信息，如内核名称、主机名、内核版本、处理机类型等等，使用 uname -a 可以查看所有信息。

### df — Disk space Free

df 查看文件系统中磁盘的使用情况–硬盘已用和可用的存储空间以及其它存储设备。你可以使用 df -h 将结果以人类可读的方式显示。

### ps — ProcesseS

ps 显示系统的运行进程。

### top — Top processes

top 命令会默认按照 CPU 的占用情况，显示占用量较大的进程,可以使用 top -u 查看某个用户的 CPU 使用排名情况。

### shutdown

shutdown 用于关闭计算机，而 shutdown -r 用于重启计算机。
