import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:typed_data';
import '../theme/app_theme.dart';

/// A widget that displays an XFile image, compatible with both web and mobile
class XFileImage extends StatefulWidget {
  final XFile? file;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? placeholder;
  final Widget? errorWidget;

  const XFileImage({
    Key? key,
    required this.file,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.placeholder,
    this.errorWidget,
  }) : super(key: key);

  @override
  State<XFileImage> createState() => _XFileImageState();
}

class _XFileImageState extends State<XFileImage> {
  Uint8List? _imageBytes;
  bool _isLoading = true;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  @override
  void didUpdateWidget(XFileImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.file != widget.file) {
      _loadImage();
    }
  }

  Future<void> _loadImage() async {
    if (widget.file == null) {
      setState(() {
        _isLoading = false;
        _hasError = true;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _hasError = false;
    });

    try {
      final bytes = await widget.file!.readAsBytes();
      if (mounted) {
        setState(() {
          _imageBytes = bytes;
          _isLoading = false;
          _hasError = false;
        });
      }
    } catch (e) {
      print('Error loading image: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
          _hasError = true;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return SizedBox(
        width: widget.width,
        height: widget.height,
        child: widget.placeholder ??
            const Center(
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
      );
    }

    if (_hasError || _imageBytes == null) {
      return SizedBox(
        width: widget.width,
        height: widget.height,
        child: widget.errorWidget ??
            Icon(
              Icons.broken_image,
              color: AppTheme.darkTextSecondary,
              size: widget.width != null && widget.height != null
                  ? (widget.width! < widget.height!
                      ? widget.width
                      : widget.height)
                  : 24,
            ),
      );
    }

    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: Image.memory(
        _imageBytes!,
        fit: widget.fit,
        errorBuilder: (context, error, stackTrace) {
          return SizedBox(
            width: widget.width,
            height: widget.height,
            child: widget.errorWidget ??
                Icon(
                  Icons.broken_image,
                  color: AppTheme.darkTextSecondary,
                  size: widget.width != null && widget.height != null
                      ? (widget.width! < widget.height!
                          ? widget.width
                          : widget.height)
                      : 24,
                ),
          );
        },
      ),
    );
  }
}

