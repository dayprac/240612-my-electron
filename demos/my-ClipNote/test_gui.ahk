#SingleInstance Force

; 创建GUI窗口
Gui, +Resize
Gui, Add, Button, x10 y10 w120 h30 gButtonClick, 测试按钮
Gui, Add, Text, x10 y50 w400 h30 vStatusText, 点击按钮查看效果

; 显示GUI窗口
Gui, Show, w420 h100, GUI测试窗口
Return

; 按钮点击事件处理
ButtonClick:
    GuiControl,, StatusText, 按钮被点击了！
Return

; 关闭窗口时退出脚本
GuiClose:
GuiEscape:
ExitApp