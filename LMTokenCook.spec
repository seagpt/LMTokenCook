# -*- mode: python ; coding: utf-8 -*-


import os

def collect_assets():
    asset_dir = 'assets'
    datas = []
    print('DEBUG: Collecting asset files for PyInstaller:')
    for root, dirs, files in os.walk(asset_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, asset_dir)
            print(f'  Adding file: {full_path} -> assets/{rel_path}')
            datas.append((full_path, os.path.join('assets', rel_path)))
    return datas

a = Analysis(
    ['gui.py'],
    pathex=[],
    binaries=[],
    datas=collect_assets(),
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='LMTokenCook',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['icon.icns'],
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='LMTokenCook',
)
app = BUNDLE(
    coll,
    name='LMTokenCook.app',
    icon='icon.icns',
    bundle_identifier=None,
)
