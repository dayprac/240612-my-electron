#SingleInstance Force

; 创建GUI窗口
Gui, +Resize
Gui, Add, Button, x10 y10 w120 h30 gRefreshList, 刷新Chrome窗口

; 显示GUI窗口
Gui, Show, w420 h360, Chrome窗口标题栏控制
Return

; 刷新按钮点击事件处理
RefreshList:
    ; 清除已有的按钮
    GuiControl, Hide, RefreshList
    Gui, Destroy
    Gui, +Resize
    Gui, Add, Button, x10 y10 w120 h30 gRefreshList, 刷新Chrome窗口
    
    ; 获取所有Chrome窗口
    WinGet, windows, List, ahk_exe chrome.exe
    yPos := 50
    Loop %windows%
    {
        try {
            windowId := windows%A_Index%
            WinGetTitle, title, ahk_id %windowId%
            if (title && windowId) ; 只添加有标题且有效的窗口
            {
                ; 为每个窗口创建一个按钮
                Gui, Add, Button, x10 y%yPos% w400 h30 gToggleTitle v%windowId%, %title%
                yPos += 40
            }
        } catch e {
            continue ; 如果获取标题出错，跳过当前窗口
        }
    }
    
    ; 显示GUI窗口
    Gui, Show, w420 h360, Chrome窗口标题栏控制
Return

; 按钮点击事件处理
ToggleTitle:
    ; 获取被点击按钮关联的窗口ID
    windowId := A_GuiControl
    
    try {
        if (windowId) {
            ; 切换标题栏显示状态
            WinGet, style, Style, ahk_id %windowId%
            if (style & 0xC00000) ; 检查标题栏是否显示
            {
                ; 隐藏标题栏
                WinSet, Style, -0xC00000, ahk_id %windowId%
            }
            else
            {
                ; 显示标题栏
                WinSet, Style, +0xC00000, ahk_id %windowId%
            }
        }
    } catch e {
        MsgBox, 无法操作选中的窗口，请重试。
        return
    }
Return

; 关闭窗口时退出脚本
GuiClose:
GuiEscape:
ExitApp