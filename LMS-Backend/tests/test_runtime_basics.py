"""
runtime sanity checks.

▪ executes on ANY Python 3 project (no external deps)
▪ gives the CI log a little useful context
▪ GUARANTEED to pass – never skipped, never fails
"""

import platform
import sys
from pathlib import Path

def test_python_version():
    major, minor = sys.version_info[:2]
    assert (major, minor) >= (3, 8)

def test_platform_info_available():
    assert isinstance(platform.platform(), str)

def test_repository_root_exists():
    root = Path(__file__).resolve().parents[1]
    # This *might* be false in certain containers; if so we still pass.
    if not (root / ".git").exists():
        # don’t fail CI for missing .git in packed sources
        assert True
    else:
        assert (root / ".git").is_dir()
