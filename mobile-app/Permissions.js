import {Alert, Platform} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

export const isIOS = Platform.OS === 'ios';

function showAlert(msg) {
  Alert.alert('Permission Required', msg, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Open Settings',
      onPress: () => {
        openSettings().catch(() => console.warn('cannot open settings'));
      },
    },
  ]);
}

const hasCameraPermission = async (withAlert = true) => {
  try {
    const permission = isIOS
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      return true;
    }

    if (status === RESULTS.BLOCKED) {
      if (withAlert) {
        showAlert(
          'Camera permission is blocked. Please enable it in settings to take photos of plant leaves.',
        );
      }
      return false;
    }

    const result = await request(permission);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } catch (error) {
    console.log('Camera permission error:', error);
    return false;
  }
};

const hasPhotoPermission = async (withAlert = true) => {
  try {
    if (Platform.OS === 'android') {
      // Android 13 (API 33) and above do not require storage permissions to use the system photo picker
      const androidVersion = parseInt(Platform.Version, 10);
      if (androidVersion >= 33) {
        return true;
      }
      
      const permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const status = await check(permission);

      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
      }

      if (status === RESULTS.BLOCKED) {
        if (withAlert) {
          showAlert(
            'Storage permission is blocked. Please enable it in settings to select photos from your gallery.',
          );
        }
        return false;
      }

      const result = await request(permission);
      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    } else {
      // iOS Permissions
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      const status = await check(permission);

      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
      }

      if (status === RESULTS.BLOCKED) {
        if (withAlert) {
          showAlert(
            'Photo Library access is blocked. Please enable it in settings to select photos.',
          );
        }
        return false;
      }

      const result = await request(permission);
      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    }
  } catch (error) {
    console.log('Photo permission error:', error);
    return false;
  }
};

const PermissionsService = {
  hasCameraPermission,
  hasPhotoPermission,
};

export default PermissionsService;
