import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/auth_provider.dart';
import '../../core/services/api_service.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final _api = ApiService();
  List<dynamic> _tasks = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTasks();
  }

  Future<void> _fetchTasks() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final endpoint = auth.role == 'Personel' ? '/tasks/my' : '/tasks';
    try {
      final response = await _api.dio.get(endpoint);
      setState(() {
        _tasks = response.data['data'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Görevler yüklenemedi';
        _isLoading = false;
      });
    }
  }

  Future<void> _updateStatus(int taskId, String newStatus) async {
    try {
      await _api.dio.put('/tasks/$taskId/status', data: {'status': newStatus});
      _fetchTasks();
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Durum güncellendi')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Güncelleme başarısız')));
      }
    }
  }

  Future<void> _confirmDelete(
    BuildContext context,
    Map<String, dynamic> task,
  ) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Görevi Sil'),
        content: Text(
          '"${task['title']}" görevini silmek istediğinize emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('İptal'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    try {
      await _api.dio.delete('/tasks/${task['id']}');
      _fetchTasks();
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Görev silindi')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Görev silinemedi')));
      }
    }
  }

  void _showEditTaskModal(BuildContext context, Map<String, dynamic> task) {
    final titleController = TextEditingController(text: task['title']);
    final descController = TextEditingController(
      text: task['description'] ?? '',
    );
    String selectedPriority = task['priority'];
    DateTime? selectedDate = task['dueDate'] != null
        ? DateTime.parse(task['dueDate'])
        : null;
    List<dynamic> users = [];
    int? selectedUserId = task['assignedUserId'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) {
          if (users.isEmpty) {
            _api.dio.get('/users').then((res) {
              setModalState(() => users = res.data['data']);
            });
          }
          return Padding(
            padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 16,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Görevi Düzenle',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () async {
                          final confirm = await showDialog<bool>(
                            context: ctx,
                            builder: (c) => AlertDialog(
                              title: const Text('İptal'),
                              content: const Text(
                                'Düzenlemeyi iptal etmek istediğinize emin misiniz?',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(c, false),
                                  child: const Text('Hayır'),
                                ),
                                FilledButton(
                                  onPressed: () => Navigator.pop(c, true),
                                  child: const Text('Evet'),
                                ),
                              ],
                            ),
                          );
                          if (confirm == true && ctx.mounted)
                            Navigator.pop(ctx);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Görev Başlığı',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descController,
                    decoration: const InputDecoration(
                      labelText: 'Açıklama',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedPriority,
                    decoration: const InputDecoration(
                      labelText: 'Öncelik',
                      border: OutlineInputBorder(),
                    ),
                    items: ['Düşük', 'Orta', 'Yüksek']
                        .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedPriority = v!),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    value: selectedUserId,
                    decoration: const InputDecoration(
                      labelText: 'Atanan Kişi',
                      border: OutlineInputBorder(),
                    ),
                    items: users
                        .map(
                          (u) => DropdownMenuItem<int>(
                            value: u['id'],
                            child: Text(u['fullName']),
                          ),
                        )
                        .toList(),
                    onChanged: (v) => setModalState(() => selectedUserId = v),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: ctx,
                        initialDate:
                            selectedDate ??
                            DateTime.now().add(const Duration(days: 7)),
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (picked != null)
                        setModalState(() => selectedDate = picked);
                    },
                    child: Text(
                      selectedDate == null
                          ? 'Bitiş Tarihi Seç'
                          : selectedDate!.toString().substring(0, 10),
                    ),
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton(
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: ctx,
                        builder: (c) => AlertDialog(
                          title: const Text('İptal'),
                          content: const Text(
                            'Düzenlemeyi iptal etmek istediğinize emin misiniz?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(c, false),
                              child: const Text('Hayır'),
                            ),
                            FilledButton(
                              onPressed: () => Navigator.pop(c, true),
                              child: const Text('Evet'),
                            ),
                          ],
                        ),
                      );
                      if (confirm == true && ctx.mounted) Navigator.pop(ctx);
                    },
                    child: const Text('İptal'),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: () async {
                      if (titleController.text.isEmpty ||
                          selectedUserId == null ||
                          selectedDate == null) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          const SnackBar(
                            content: Text('Tüm alanları doldurun'),
                          ),
                        );
                        return;
                      }
                      final confirm = await showDialog<bool>(
                        context: ctx,
                        builder: (c) => AlertDialog(
                          title: const Text('Görevi Güncelle'),
                          content: const Text(
                            'Değişiklikleri kaydetmek istediğinize emin misiniz?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(c, false),
                              child: const Text('İptal'),
                            ),
                            FilledButton(
                              onPressed: () => Navigator.pop(c, true),
                              child: const Text('Evet'),
                            ),
                          ],
                        ),
                      );
                      if (confirm != true) return;
                      try {
                        await _api.dio.put(
                          '/tasks/${task['id']}',
                          data: {
                            'title': titleController.text,
                            'description': descController.text,
                            'assignedUserId': selectedUserId,
                            'priority': selectedPriority,
                            'dueDate': selectedDate!.toIso8601String(),
                          },
                        );
                        if (ctx.mounted) Navigator.pop(ctx);
                        _fetchTasks();
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Görev güncellendi')),
                          );
                        }
                      } catch (e) {
                        if (ctx.mounted) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(
                              content: Text('Güncelleme başarısız'),
                            ),
                          );
                        }
                      }
                    },
                    child: const Text('Güncelle'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showTaskDetail(BuildContext context, Map<String, dynamic> task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Görev Detayı',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const Divider(),
            const SizedBox(height: 8),
            _detailRow('Başlık', task['title']),
            _detailRow('Açıklama', task['description'] ?? '-'),
            _detailRow('Atanan Kişi', task['assignedUserName'] ?? '-'),
            _detailRow('Öncelik', task['priority']),
            _detailRow('Durum', task['status']),
            _detailRow(
              'Bitiş Tarihi',
              task['dueDate']?.toString().substring(0, 10) ?? '-',
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  Color _priorityColor(String priority) {
    switch (priority) {
      case 'Yüksek':
        return Colors.red;
      case 'Orta':
        return Colors.orange;
      case 'Düşük':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  Widget _priorityBars(String priority) {
    int activeBars;
    switch (priority) {
      case 'Yüksek':
        activeBars = 3;
        break;
      case 'Orta':
        activeBars = 2;
        break;
      default:
        activeBars = 1;
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: List.generate(activeBars, (i) {
        final double height = 6.0 + (i * 4.0);
        return Container(
          width: 5,
          height: height,
          margin: const EdgeInsets.only(right: 3),
          decoration: BoxDecoration(
            color: const Color(0xFF334155),
            borderRadius: BorderRadius.circular(2),
          ),
        );
      }),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Tamamlandı':
        return Colors.green;
      case 'Başladı':
        return Colors.blue;
      case 'Bekliyor':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final isPersonel = auth.role == 'Personel';

    return Scaffold(
      floatingActionButton: isPersonel
          ? null
          : FloatingActionButton(
              onPressed: () => _showCreateTaskModal(context),
              child: const Icon(Icons.add),
            ),
      body: RefreshIndicator(
        onRefresh: _fetchTasks,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
            ? Center(child: Text(_error!))
            : _tasks.isEmpty
            ? const Center(child: Text('Henüz hiç görev yok'))
            : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _tasks.length,
                itemBuilder: (context, index) {
                  final task = _tasks[index];
                  return GestureDetector(
                    onTap: () => _showTaskDetail(context, task),
                    child: Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    task['title'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color.fromARGB(
                                      255,
                                      211,
                                      211,
                                      211,
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      _priorityBars(task['priority']),
                                      const SizedBox(width: 6),
                                      Text(
                                        task['priority'],
                                        style: const TextStyle(
                                          color: Color(0xFF334155),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Atanan: ${task['assignedUserName']}',
                              style: const TextStyle(color: Colors.grey),
                            ),
                            Text(
                              'Bitiş: ${task['dueDate']?.toString().substring(0, 10) ?? '-'}',
                              style: const TextStyle(color: Colors.grey),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                DropdownButton<String>(
                                  value: task['status'],
                                  isDense: true,
                                  items: ['Bekliyor', 'Başladı', 'Tamamlandı']
                                      .map(
                                        (s) => DropdownMenuItem(
                                          value: s,
                                          child: Text(s),
                                        ),
                                      )
                                      .toList(),
                                  onChanged: (newStatus) {
                                    if (newStatus != null) {
                                      _updateStatus(task['id'], newStatus);
                                    }
                                  },
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _statusColor(
                                      task['status'],
                                    ).withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    task['status'],
                                    style: TextStyle(
                                      color: _statusColor(task['status']),
                                      fontSize: 12,
                                    ),
                                  ),
                                ),

                                if (!isPersonel)
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      IconButton(
                                        icon: const Icon(
                                          Icons.edit_outlined,
                                          size: 20,
                                        ),
                                        onPressed: () =>
                                            _showEditTaskModal(context, task),
                                      ),
                                      IconButton(
                                        icon: const Icon(
                                          Icons.delete_outline,
                                          size: 20,
                                          color: Colors.red,
                                        ),
                                        onPressed: () =>
                                            _confirmDelete(context, task),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }

  void _showCreateTaskModal(BuildContext context) {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    String selectedPriority = 'Orta';
    DateTime? selectedDate;
    List<dynamic> users = [];
    int? selectedUserId;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          if (users.isEmpty) {
            _api.dio.get('/users').then((res) {
              setModalState(() => users = res.data['data']);
            });
          }

          return Padding(
            padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 16,
              bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Yeni Görev Oluştur',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () async {
                          final confirm = await showDialog<bool>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('İptal'),
                              content: const Text(
                                'Yeni görev oluşturmayı iptal etmek istediğinize emin misiniz?',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx, false),
                                  child: const Text('Hayır'),
                                ),
                                FilledButton(
                                  onPressed: () => Navigator.pop(ctx, true),
                                  child: const Text('Evet'),
                                ),
                              ],
                            ),
                          );
                          if (confirm == true && context.mounted)
                            Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Görev Başlığı',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descController,
                    decoration: const InputDecoration(
                      labelText: 'Açıklama',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: selectedPriority,
                    decoration: const InputDecoration(
                      labelText: 'Öncelik',
                      border: OutlineInputBorder(),
                    ),
                    items: ['Düşük', 'Orta', 'Yüksek']
                        .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedPriority = v!),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    value: selectedUserId,
                    decoration: const InputDecoration(
                      labelText: 'Atanan Kişi',
                      border: OutlineInputBorder(),
                    ),
                    items: users
                        .map(
                          (u) => DropdownMenuItem<int>(
                            value: u['id'],
                            child: Text(u['fullName']),
                          ),
                        )
                        .toList(),
                    onChanged: (v) => setModalState(() => selectedUserId = v),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now().add(
                          const Duration(days: 7),
                        ),
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (picked != null) {
                        setModalState(() => selectedDate = picked);
                      }
                    },
                    child: Text(
                      selectedDate == null
                          ? 'Bitiş Tarihi Seç'
                          : selectedDate!.toString().substring(0, 10),
                    ),
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton(
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('İptal'),
                          content: const Text(
                            'Yeni görev oluşturmayı iptal etmek istediğinize emin misiniz?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx, false),
                              child: const Text('Hayır'),
                            ),
                            FilledButton(
                              onPressed: () => Navigator.pop(ctx, true),
                              child: const Text('Evet'),
                            ),
                          ],
                        ),
                      );
                      if (confirm == true && context.mounted)
                        Navigator.pop(context);
                    },
                    child: const Text('İptal'),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: () async {
                      if (titleController.text.isEmpty ||
                          selectedUserId == null ||
                          selectedDate == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Tüm alanları doldurun'),
                          ),
                        );
                        return;
                      }
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('Görev Oluştur'),
                          content: const Text(
                            'Yeni görev oluşturmak istediğinize emin misiniz?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx, false),
                              child: const Text('İptal'),
                            ),
                            FilledButton(
                              onPressed: () => Navigator.pop(ctx, true),
                              child: const Text('Evet'),
                            ),
                          ],
                        ),
                      );
                      if (confirm != true) return;
                      try {
                        await _api.dio.post(
                          '/tasks',
                          data: {
                            'title': titleController.text,
                            'description': descController.text,
                            'assignedUserId': selectedUserId,
                            'priority': selectedPriority,
                            'dueDate': selectedDate!.toIso8601String(),
                          },
                        );
                        if (context.mounted) Navigator.pop(context);
                        _fetchTasks();
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Görev oluşturuldu')),
                          );
                        }
                      } catch (e) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Görev oluşturulamadı'),
                            ),
                          );
                        }
                      }
                    },
                    child: const Text('Oluştur'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
