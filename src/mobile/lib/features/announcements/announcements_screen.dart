import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/auth_provider.dart';
import '../../core/services/api_service.dart';

class AnnouncementsScreen extends StatefulWidget {
  const AnnouncementsScreen({super.key});

  @override
  State<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends State<AnnouncementsScreen> {
  final _api = ApiService();
  List<dynamic> _announcements = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchAnnouncements();
  }

  Future<void> _fetchAnnouncements() async {
    try {
      final response = await _api.dio.get('/announcements');
      setState(() {
        _announcements = response.data['data'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Duyurular yüklenemedi';
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleStatus(int id, bool currentStatus) async {
    try {
      await _api.dio.put(
        '/announcements/$id',
        data: {'isActive': !currentStatus},
      );
      _fetchAnnouncements();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              !currentStatus ? 'Duyuru aktif edildi' : 'Duyuru pasif edildi',
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('İşlem başarısız')));
      }
    }
  }

  Future<bool> _showCancelConfirm(BuildContext ctx) async {
    final confirm = await showDialog<bool>(
      context: ctx,
      builder: (c) => AlertDialog(
        title: const Text('İptal'),
        content: const Text(
          'Duyuru oluşturmayı iptal etmek istediğinize emin misiniz?',
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
    return confirm == true;
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final isPersonel = auth.role == 'Personel';

    return Scaffold(
      floatingActionButton: isPersonel
          ? null
          : FloatingActionButton(
              onPressed: () => _showCreateModal(context),
              child: const Icon(Icons.add),
            ),
      body: RefreshIndicator(
        onRefresh: _fetchAnnouncements,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
            ? Center(child: Text(_error!))
            : _announcements.isEmpty
            ? const Center(child: Text('Henüz hiç duyuru yok'))
            : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _announcements.length,
                itemBuilder: (context, index) {
                  final ann = _announcements[index];
                  final isActive = ann['isActive'] == true;
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: isActive
                            ? Colors.green.withOpacity(0.2)
                            : Colors.grey.withOpacity(0.2),
                        child: Icon(
                          Icons.campaign,
                          color: isActive ? Colors.green : Colors.grey,
                        ),
                      ),
                      title: Text(
                        ann['title'],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ann['content'] ?? ''),
                          const SizedBox(height: 4),
                          Text(
                            ann['publishDate']?.toString().substring(0, 10) ??
                                '',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      trailing: isPersonel
                          ? null
                          : Switch(
                              value: isActive,
                              onChanged: (_) =>
                                  _toggleStatus(ann['id'], isActive),
                            ),
                    ),
                  );
                },
              ),
      ),
    );
  }

  void _showCreateModal(BuildContext context) {
    final titleController = TextEditingController();
    final contentController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
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
                      'Yeni Duyuru',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () async {
                        if (await _showCancelConfirm(ctx) && ctx.mounted) {
                          Navigator.pop(ctx);
                        }
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: 'Duyuru Başlığı',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: contentController,
                  decoration: const InputDecoration(
                    labelText: 'İçerik',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 4,
                ),
                const SizedBox(height: 16),
                OutlinedButton(
                  onPressed: () async {
                    if (await _showCancelConfirm(ctx) && ctx.mounted) {
                      Navigator.pop(ctx);
                    }
                  },
                  child: const Text('İptal'),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: () async {
                    if (titleController.text.isEmpty ||
                        contentController.text.isEmpty) {
                      ScaffoldMessenger.of(ctx).showSnackBar(
                        const SnackBar(content: Text('Tüm alanları doldurun')),
                      );
                      return;
                    }
                    final confirm = await showDialog<bool>(
                      context: ctx,
                      builder: (c) => AlertDialog(
                        title: const Text('Duyuru Yayınla'),
                        content: const Text(
                          'Duyuruyu yayınlamak istediğinize emin misiniz?',
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
                      await _api.dio.post(
                        '/announcements',
                        data: {
                          'title': titleController.text,
                          'content': contentController.text,
                        },
                      );
                      if (ctx.mounted) Navigator.pop(ctx);
                      _fetchAnnouncements();
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Duyuru yayınlandı')),
                        );
                      }
                    } catch (e) {
                      if (ctx.mounted) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          const SnackBar(content: Text('Duyuru yayınlanamadı')),
                        );
                      }
                    }
                  },
                  child: const Text('Yayınla'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
