from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Learning Management System API",
        default_version='v1',
        description="Comprehensive API documentation for the Learning Management System",
        terms_of_service="https://learning-management-system-fullstack.vercel.app/",
        contact=openapi.Contact(email="hoangson091104@gmail.com", name="Learning Management System", url="https://learning-management-system-fullstack.vercel.app/"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', RedirectView.as_view(url='/swagger', permanent=False)),  # Redirect base URL to Swagger UI URL
]
