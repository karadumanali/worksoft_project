import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/auth_provider.dart';
import '../../core/services/api_service.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  final _api = ApiService();
  List<dynamic> _users = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    try {
      final response = await _api.dio.get('/users');
      setState(() {
        _users = response.data['data'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Kullanıcılar yüklenemedi';
        _isLoading = false;
      });
    }
  }

  Future<bool> _showCancelConfirm(BuildContext ctx, String action) async {
    final confirm = await showDialog<bool>(
      context: ctx,
      builder: (c) => AlertDialog(
        title: const Text('İptal'),
        content: Text(
          '$action işlemini iptal etmek istediğinize emin misiniz?',
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

  Color _roleColor(String role) {
    switch (role) {
      case 'Admin':
        return Colors.red;
      case 'Yönetici':
        return Colors.blue;
      case 'Personel':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kullanıcılar')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showUserModal(context, null),
        child: const Icon(Icons.person_add),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchUsers,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
            ? Center(child: Text(_error!))
            : _users.isEmpty
            ? const Center(child: Text('Henüz hiç kullanıcı yok'))
            : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _users.length,
                itemBuilder: (context, index) {
                  final user = _users[index];
                  final isActive = user['isActive'] == true;
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: _roleColor(
                          user['role'],
                        ).withOpacity(0.2),
                        child: Text(
                          user['fullName'][0].toUpperCase(),
                          style: TextStyle(color: _roleColor(user['role'])),
                        ),
                      ),
                      title: Text(
                        user['fullName'],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(user['email']),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: _roleColor(
                                    user['role'],
                                  ).withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  user['role'],
                                  style: TextStyle(
                                    color: _roleColor(user['role']),
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: isActive
                                      ? Colors.green.withOpacity(0.15)
                                      : Colors.grey.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  isActive ? 'Aktif' : 'Pasif',
                                  style: TextStyle(
                                    color: isActive
                                        ? Colors.green
                                        : Colors.grey,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.edit_outlined),
                        onPressed: () => _showUserModal(context, user),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }

  void _showUserModal(
    BuildContext context,
    Map<String, dynamic>? existingUser,
  ) {
    final isEditing = existingUser != null;
    final fullNameController = TextEditingController(
      text: isEditing ? existingUser['fullName'] : '',
    );
    final emailController = TextEditingController(
      text: isEditing ? existingUser['email'] : '',
    );
    final passwordController = TextEditingController();
    String selectedRole = isEditing ? existingUser['role'] : 'Personel';
    bool isActive = isEditing ? existingUser['isActive'] : true;
    bool resetPassword = false;

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
                    Text(
                      isEditing ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () async {
                        if (await _showCancelConfirm(
                              ctx,
                              isEditing ? 'Düzenleme' : 'Ekleme',
                            ) &&
                            ctx.mounted) {
                          Navigator.pop(ctx);
                        }
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: fullNameController,
                  decoration: const InputDecoration(
                    labelText: 'Ad Soyad',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'E-posta',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 12),
                if (!isEditing)
                  TextField(
                    controller: passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Şifre',
                      border: OutlineInputBorder(),
                    ),
                  ),
                if (!isEditing) const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: selectedRole,
                  decoration: const InputDecoration(
                    labelText: 'Rol',
                    border: OutlineInputBorder(),
                  ),
                  items: ['Admin', 'Yönetici', 'Personel']
                      .map((r) => DropdownMenuItem(value: r, child: Text(r)))
                      .toList(),
                  onChanged: (v) => setModalState(() => selectedRole = v!),
                ),
                const SizedBox(height: 12),
                if (isEditing)
                  SwitchListTile(
                    title: const Text('Hesap Aktif'),
                    value: isActive,
                    onChanged: (v) => setModalState(() => isActive = v),
                  ),
                if (isEditing)
                  SwitchListTile(
                    title: const Text('Şifreyi Sıfırla'),
                    subtitle: const Text('Geçici şifre e-posta ile iletilir'),
                    value: resetPassword,
                    onChanged: (v) => setModalState(() => resetPassword = v),
                  ),
                const SizedBox(height: 16),
                OutlinedButton(
                  onPressed: () async {
                    if (await _showCancelConfirm(
                          ctx,
                          isEditing ? 'Düzenleme' : 'Ekleme',
                        ) &&
                        ctx.mounted) {
                      Navigator.pop(ctx);
                    }
                  },
                  child: const Text('İptal'),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: () async {
                    if (fullNameController.text.isEmpty ||
                        emailController.text.isEmpty) {
                      ScaffoldMessenger.of(ctx).showSnackBar(
                        const SnackBar(content: Text('Tüm alanları doldurun')),
                      );
                      return;
                    }
                    final confirm = await showDialog<bool>(
                      context: ctx,
                      builder: (c) => AlertDialog(
                        title: Text(
                          isEditing ? 'Kullanıcıyı Güncelle' : 'Kullanıcı Ekle',
                        ),
                        content: Text(
                          isEditing
                              ? 'Kullanıcı bilgilerini güncellemek istediğinize emin misiniz?'
                              : 'Yeni kullanıcı eklemek istediğinize emin misiniz?',
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
                      if (isEditing) {
                        await _api.dio.put(
                          '/users/${existingUser['id']}',
                          data: {
                            'fullName': fullNameController.text,
                            'email': emailController.text,
                            'roleId': _roleToId(selectedRole),
                            'isActive': isActive,
                            'resetPassword': resetPassword,
                          },
                        );
                      } else {
                        await _api.dio.post(
                          '/users',
                          data: {
                            'fullName': fullNameController.text,
                            'email': emailController.text,
                            'tempPassword': passwordController.text,
                            'roleId': _roleToId(selectedRole),
                            'isActive': isActive,
                          },
                        );
                      }
                      if (ctx.mounted) Navigator.pop(ctx);
                      _fetchUsers();
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              isEditing
                                  ? 'Kullanıcı güncellendi'
                                  : 'Kullanıcı eklendi',
                            ),
                          ),
                        );
                      }
                    } catch (e) {
                      if (ctx.mounted) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          const SnackBar(content: Text('İşlem başarısız')),
                        );
                      }
                    }
                  },
                  child: Text(isEditing ? 'Güncelle' : 'Ekle'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  int _roleToId(String role) {
    switch (role) {
      case 'Admin':
        return 1;
      case 'Yönetici':
        return 2;
      case 'Personel':
        return 3;
      default:
        return 3;
    }
  }
}
