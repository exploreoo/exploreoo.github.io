---
icon: pen-to-square
date: 2024-12-12
category:
  - 前端
tag:
  - Windows
  - 性能优化
---

# 解决win10系统CPU占用过高

- **关闭Windows Search**
  控制面板–管理工具–服务- Windows Search禁用。

- **禁用 Diagnostics Tracking Service和Connected User Experiences and Telemetry**
  这个服务是用来服务跟踪诊断的，就是在咱们使用系统的时候不停地收集系统信息，是微软的一个搜集工具而已。在很多情况下，CPU的高占用率就是它搞的鬼。
  win+R 运行 services.msc 进入服务，禁用Diagnostics Tracking Service ，若找不到这个服务的话那就是禁用Diagnostic Policy Service，然后禁用Connected User Experiences and Telemetry 就好。

- **关闭允许后台运行的软件**
  打开系统设置— 隐私 —后台应用 关闭不需要的应用即可 （大多数其实都没什么用可以直接关闭最上方按钮）

- **关闭更新来自多个位置**
  打开系统设置—更新和安全—Windows更新—高级选项—选择如何提供更新，将“更新来自多个位置”关闭即可

- **关闭小娜**
  使用组策略禁用Cortana
  　　1、使用 Windows + R 快捷键打开「运行」— 执行 gpedit.msc 打开组策略编辑器。
  　　2、导航到「计算机配置」—「管理模板」—「Windows [组件](https://edu.csdn.net/cloud/houjie?utm_source=highword&spm=1001.2101.3001.7020)」—「搜索」。
  　　3、在右侧面板中找到「允许使用 Cortana」条目，将其设置为「已禁用」即可。

- **修改处理器个数**

  \1. 同时按住**Win+r**打开运行框，输入**msconfig**指令，点击**回车**。

  \2. 点击**引导**，再点击**高级选项**。

  \3. 点击**处理器个数**下方的选项框，选择大的数字，再点击**确定**。

<!-- more -->

- **更新驱动程序**

  过时的或不兼容的驱动程序可能导致CPU占用率升高。可以通过更新驱动程序来解决这个问题。可以在设备管理器中检查并更新驱动程序，或者从硬件厂商的官方网站下载新的驱动程序。

  \1. 右键单击**“开始”**菜单，然后选择**“设备管理器”**。

  \2. 选择你的硬盘，然后右键单击它并选择列表中的**“更新驱动程序”**。

- **关闭开机时多余的启动项**

  现在很多软件安装完毕后都会自动添加到系统启动项里，开机后也会占用一部分的CPU进程，我们可以通过简单的设置关闭一些不必要的启动项目。

  \1. 在左下角搜索框输入**任务管理器**，点击**回车**进入任务管理器。

  <img src="https://www.disktool.cn/content-center/images/images369/what-if-the-cpu-occupation-is-too-high-369/2.png" alt="进入任务管理器" style="width: 80%;" />

  \2. 点击任务管理器窗口的**启动**选项，鼠标右键单击需要关闭启动的进程，在弹出的界面上点击**禁用**即可。

  <img src="https://www.disktool.cn/content-center/images/images369/what-if-the-cpu-occupation-is-too-high-369/7.png" alt="禁用" style="width: 80%;" />
