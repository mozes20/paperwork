import sys
import os
import win32api
import win32print

printer_name = win32print.GetDefaultPrinter ()
os.startfile("report.docx", "print")

print(printer_name)

win32api.ShellExecute (
  0,
  "printto",
  "./report.docx",
  '"%s"' % win32print.GetDefaultPrinter (),
  ".",
  0
)



sys.stdout.flush()
