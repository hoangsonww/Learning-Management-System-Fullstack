"""
Test bootstrap.

Creates lightweight stub-modules for Django/DRF/Swagger so that importing the
project’s views never crashes in bare-bones CI runners.

This file is imported automatically by pytest before any tests run.
"""
import sys
import types


def _install(name: str) -> types.ModuleType:
    mod = types.ModuleType(name)
    sys.modules[name] = mod
    return mod


# ------------------------------------------------------------------------------
# Stub   rest_framework & viewsets
# ------------------------------------------------------------------------------
rf = _install("rest_framework")
rf_viewsets = _install("rest_framework.viewsets")

class _FakeModelViewSet:  # noqa: N801  (camelCase here mimics DRF)
    pass

rf_viewsets.ModelViewSet = _FakeModelViewSet
rf.viewsets = rf_viewsets

# ------------------------------------------------------------------------------
# Stub   drf_yasg  (swagger)  →   just a no-op decorator
# ------------------------------------------------------------------------------
yasg = _install("drf_yasg")
yasg_utils = _install("drf_yasg.utils")
yasg_openapi = _install("drf_yasg.openapi")

def swagger_auto_schema(*_, **__):
    """Decorator that simply returns the original function unchanged."""
    def _decorator(func):
        func.__swagger_stub__ = True  # handy flag for tests
        return func
    return _decorator

yasg_utils.swagger_auto_schema = swagger_auto_schema

# expose to parent package
yasg.utils = yasg_utils
yasg.openapi = yasg_openapi

# ------------------------------------------------------------------------------
# Stub   project  models / serializers   (empty objects are enough)
# ------------------------------------------------------------------------------
for pkg in ("models", "serializers", ".models", ".serializers"):
    _install(pkg)
