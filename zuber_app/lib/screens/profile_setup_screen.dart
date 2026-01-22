import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'user_home_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  final String phoneNumber;
  final String? email;

  const ProfileSetupScreen({
    Key? key,
    required this.phoneNumber,
    this.email,
  }) : super(key: key);

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  
  bool _isNameValid() {
    return _nameController.text.trim().isNotEmpty;
  }
  
  File? _image;
  bool _isLoading = false;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _createProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    try {
      String fullName = _nameController.text.trim();
      String firstName = fullName.split(' ').first;
      String lastName = fullName.contains(' ') ? fullName.substring(fullName.indexOf(' ') + 1) : '';
      
      final success = await authProvider.createProfile(
        phoneNumber: widget.phoneNumber,
        email: widget.email,
        firstName: firstName,
        lastName: lastName,
        profilePicture: _image,
      );

      if (success && mounted) {
        // Navigate to home screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const UserHomeScreen()),
        );
      } else if (mounted && authProvider.error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.error!),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to create profile: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(AppTheme.spacingXL),
            child: Form(
              key: _formKey,
              onChanged: () {
                // Trigger validation when text changes
                setState(() {});
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                const SizedBox(height: AppTheme.spacingXXL),
                
                // Logo
                Container(
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.person_add,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXL),
                
                Text(
                  'Complete Your Profile',
                  style: AppTheme.heading1.copyWith(
                    color: AppTheme.darkTextPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppTheme.spacingS),
                Text(
                  'Tell us more about yourself',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.darkTextSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppTheme.spacingXXL),

                // Profile Picture
                Center(
                  child: Stack(
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primaryColor,
                            width: 2,
                          ),
                        ),
                        child: ClipOval(
                          child: _image != null
                              ? Image.file(
                                  _image!,
                                  width: 120,
                                  height: 120,
                                  fit: BoxFit.cover,
                                )
                              : Container(
                                  width: 120,
                                  height: 120,
                                  color: AppTheme.darkCardColor,
                                  child: Icon(
                                    Icons.person,
                                    size: 60,
                                    color: AppTheme.darkTextSecondary,
                                  ),
                                ),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTap: _pickImage,
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppTheme.darkSurfaceColor,
                                width: 2,
                              ),
                            ),
                            child: const Icon(
                              Icons.add_a_photo,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXL),

                // Full Name Field
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                    prefixIcon: Icon(Icons.person, color: AppTheme.primaryColor),
                    filled: true,
                    fillColor: AppTheme.darkCardColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(color: AppTheme.darkDividerColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(color: AppTheme.darkDividerColor),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(
                        color: AppTheme.primaryColor,
                        width: 2,
                      ),
                    ),
                  ),
                  onChanged: (_) {
                    // Trigger rebuild to update button state
                    setState(() {});
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your full name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppTheme.spacingXL),

                // Create Profile Button
                Container(
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: _isNameValid() && !_isLoading ? AppTheme.primaryGradient : AppTheme.disabledGradient,
                    borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    boxShadow: AppTheme.elevatedShadow,
                  ),
                  child: ElevatedButton(
                    onPressed: _isLoading || !_isNameValid() ? null : _createProfile,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(
                            'Create Profile',
                            style: AppTheme.buttonText,
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }
}