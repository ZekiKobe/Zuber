import 'package:flutter/material.dart';
import '../utils/constants.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({Key? key}) : super(key: key);

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  final List<Map<String, dynamic>> _faqItems = [
    {
      'question': 'How do I request a ride?',
      'answer': 'Open the app, enter your destination, and tap "Request Ride". A nearby driver will accept your request.',
    },
    {
      'question': 'How do I pay for my ride?',
      'answer': 'Payment is automatically processed through your saved payment method after your ride is completed.',
    },
    {
      'question': 'How do I rate my driver?',
      'answer': 'After your ride is completed, you can rate your driver on a scale of 1 to 5 stars.',
    },
    {
      'question': 'What should I do if I left something in the car?',
      'answer': 'Contact support through the app or call our customer service to help locate your item.',
    },
    {
      'question': 'How do I cancel a ride?',
      'answer': 'You can cancel a ride before the driver arrives by tapping "Cancel Ride" in the app.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.paddingMedium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Frequently Asked Questions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            // FAQ Items
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _faqItems.length,
              itemBuilder: (context, index) {
                final item = _faqItems[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: AppDimensions.paddingMedium),
                  child: ExpansionTile(
                    title: Text(
                      item['question'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                        child: Text(
                          item['answer'],
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 30),
            
            // Contact Support
            const Text(
              'Contact Support',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.phone),
                    title: const Text('Call Support'),
                    subtitle: const Text('+1 (800) 123-4567'),
                    onTap: () {
                      // Handle phone call
                    },
                  ),
                  const Divider(height: 0),
                  ListTile(
                    leading: const Icon(Icons.email),
                    title: const Text('Email Support'),
                    subtitle: const Text('support@zuber.com'),
                    onTap: () {
                      // Handle email
                    },
                  ),
                  const Divider(height: 0),
                  ListTile(
                    leading: const Icon(Icons.chat),
                    title: const Text('Live Chat'),
                    subtitle: const Text('Chat with our support team'),
                    onTap: () {
                      // Handle live chat
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            
            // Emergency Contact
            const Text(
              'Emergency Contact',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            Card(
              child: ListTile(
                leading: const Icon(
                  Icons.emergency,
                  color: Colors.red,
                ),
                title: const Text('Emergency Services'),
                subtitle: const Text('Call 911 or local emergency number'),
                onTap: () {
                  // Handle emergency call
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}