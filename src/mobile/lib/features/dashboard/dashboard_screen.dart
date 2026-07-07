import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/auth_provider.dart';
import '../../core/services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _api = ApiService();
  Map<String, dynamic>? _summary;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchSummary();
  }

  Future<void> _fetchSummary() async {
    try {
      final response = await _api.dio.get('/dashboard/summary');
      setState(() {
        _summary = response.data['data'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Veriler yüklenemedi';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _fetchSummary,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
            ? Center(child: Text(_error!))
            : SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      children: [
                        _StatCard(
                          title: 'Toplam Görev',
                          value: '${_summary?['totalTasks'] ?? 0}',
                          icon: Icons.task_alt,
                          color: Colors.blue,
                        ),
                        _StatCard(
                          title: 'Tamamlanan',
                          value: '${_summary?['completedTasks'] ?? 0}',
                          icon: Icons.check_circle_outline,
                          color: Colors.green,
                        ),
                        _StatCard(
                          title: 'Bekleyen',
                          value: '${_summary?['pendingTasks'] ?? 0}',
                          icon: Icons.hourglass_empty,
                          color: Colors.orange,
                        ),
                        _StatCard(
                          title: 'Kullanıcılar',
                          value:
                              '${(_summary?['userSummaries'] as List?)?.length ?? 0}',
                          icon: Icons.people_outline,
                          color: Colors.purple,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Kullanıcı Bazlı Özet',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    if (_summary?['userSummaries'] != null)
                      ...(_summary!['userSummaries'] as List).map(
                        (user) => _UserSummaryCard(user: user),
                      ),
                  ],
                ),
              ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(
                context,
              ).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _UserSummaryCard extends StatelessWidget {
  final Map<String, dynamic> user;
  const _UserSummaryCard({required this.user});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.person)),
        title: Text(user['fullName'] ?? ''),
        subtitle: Text(
          'Toplam: ${user['total']}  •  Tamamlanan: ${user['completed']}  •  Bekleyen: ${user['pending']}',
        ),
      ),
    );
  }
}
