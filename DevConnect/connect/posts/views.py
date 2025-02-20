
# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Post.objects.all()
        view_type = self.request.query_params.get('view_type', 'home')
        username = self.request.query_params.get('username')

        if view_type == 'profile' and username:
            return queryset.filter(author__username=username)
        elif view_type == 'following':
            following_users = self.request.user.following.all()
            return queryset.filter(author__in=following_users)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['POST'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        like, created = Like.objects.get_or_create(post=post, user=user)
        
        if not created:
            like.delete()
            return Response({
                "message": "Post unliked successfully",
                "is_liked": False,
                "likes_count": post.likes.count()
            })

        return Response({
            "message": "Post liked successfully",
            "is_liked": True,
            "likes_count": post.likes.count()
        })

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(parent_comment=None)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post)

    @action(detail=True, methods=['POST'])
    def reply(self, request, pk=None):
        parent_comment = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                author=request.user,
                post=parent_comment.post,
                parent_comment=parent_comment
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# init.py – It’s an empty Python file. It is called when the package or one of its modules is imported. This file tells the Python interpreter that this directory is a package and that the presence of the _init.py file makes it a Python project.
# manage.py – This file is used to interact with your project from the command line utility. with the help of this command, we can manage several commands such as: 
# manage.py runserver
# manage.py makemigration
# manage.py migrate’ etc
# setting.py – It is the most important file in Django projects. It holds all the configuration values that your web app needs to work, i.e. pre-installed, apps, middleware, default database, API keys, and a bunch of other stuff. 
# views.py – The View shows the user the model’s data. The view knows how to get to the data in the model, but it has no idea what that data represents or what the user may do with it.
# urls.py – It is a universal resource locator which contains all the endpoints, we store all links of the project and functions to call it.
# models.py – The Model represents the models of web applications in the form of classes, it contains no logic that describes how to present the data to a user.
# wsgi.py – WSGI stands for Web Server Gateway Interface, This file is used for deploying the project in WSGI. It helps communication between your Django application and the web server. more…
# admin.py – It is used to create a superuser Registering model, login, and use the web application.
# app.py – It is a file that helps the user to include the application configuration for their app.