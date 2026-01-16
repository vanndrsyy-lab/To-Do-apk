# https://www.youtube.com/@CodeToDesignOfficial
# Program To-Do List dengan Python

tasks = []

def show_menu():
    print("\n--- TO-DO LIST ---")
    print("1. Tambah Tugas")
    print("2. Lihat Tugas")
    print("3. Tandai Tugas Selesai")
    print("4. Hapus Tugas")
    print("5. Keluar")

def add_task():
    task = input("Masukkan tugas: ")
    tasks.append({"task": task, "done": False})
    print(f"Tugas '{task}' berhasil ditambahkan.")

def view_task():
    if not tasks:
        print("Belum ada tugas.")
        return

    print("\nDaftar Tugas:")
    for index, task in enumerate(tasks, start=1):
        status = "✓" if task["done"] else "✗"
        print(f"{index}. {task['task']} [{status}]")

def mark_done():
    view_task()
    if not tasks:
        return

    try:
        index = int(input("Masukkan nomor tugas yang sudah selesai: ")) - 1
        if 0 <= index < len(tasks):
            tasks[index]["done"] = True
            print("Tugas berhasil ditandai sebagai selesai.")
        else:
            print("Nomor tidak valid.")
    except ValueError:
        print("Masukkan angka yang valid.")

def delete_task():
    view_task()
    if not tasks:
        return

    try:
        index = int(input("Masukkan nomor tugas yang ingin dihapus: ")) - 1
        if 0 <= index < len(tasks):
            removed = tasks.pop(index)
            print(f"Tugas '{removed['task']}' berhasil dihapus.")
        else:
            print("Nomor tidak valid.")
    except ValueError:
        print("Masukkan angka yang valid.")

while True:
    show_menu()
    choice = input("Pilih menu (1-5): ")

    if choice == "1":
        add_task()
    elif choice == "2":
        view_task()
    elif choice == "3":
        mark_done()
    elif choice == "4":
        delete_task()
    elif choice == "5":
        print("Program selesai. Sampai jumpa!")
        break
    else:
        print("Pilihan tidak valid. Coba lagi.")