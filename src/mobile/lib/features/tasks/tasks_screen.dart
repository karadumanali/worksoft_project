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
      appBar: AppBar(title: const Text('Görevler')),
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
                  return Card(
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
                                  color: _priorityColor(
                                    task['priority'],
                                  ).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  task['priority'],
                                  style: TextStyle(
                                    color: _priorityColor(task['priority']),
                                    fontSize: 12,
                                  ),
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
                            ],
                          ),
                        ],
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
