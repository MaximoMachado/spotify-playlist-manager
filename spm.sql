PGDMP     "                    x            spm    13.1    13.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    spm    DATABASE     g   CREATE DATABASE spm WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE spm;
                postgres    false            �            1259    16576    session    TABLE     �   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         heap    postgres    false            �            1259    16432    track_in_playlist    TABLE     g   CREATE TABLE public.track_in_playlist (
    playlist_uri text NOT NULL,
    track_uri text NOT NULL
);
 %   DROP TABLE public.track_in_playlist;
       public         heap    postgres    false            �            1259    16395    user    TABLE     �   CREATE TABLE public."user" (
    uri text NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ready boolean DEFAULT false
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    16412    user_saved_playlist    TABLE     h   CREATE TABLE public.user_saved_playlist (
    user_uri text NOT NULL,
    playlist_uri text NOT NULL
);
 '   DROP TABLE public.user_saved_playlist;
       public         heap    postgres    false            <           2606    16583    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public            postgres    false    203            9           2606    16494 (   track_in_playlist track_in_playlist_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.track_in_playlist
    ADD CONSTRAINT track_in_playlist_pkey PRIMARY KEY (playlist_uri, track_uri) INCLUDE (playlist_uri, track_uri);
 R   ALTER TABLE ONLY public.track_in_playlist DROP CONSTRAINT track_in_playlist_pkey;
       public            postgres    false    202    202    202    202            3           2606    16444    user uri 
   CONSTRAINT     D   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uri UNIQUE (uri);
 4   ALTER TABLE ONLY public."user" DROP CONSTRAINT uri;
       public            postgres    false    200            5           2606    16421    user user_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (uri);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    200            7           2606    16478 ,   user_saved_playlist user_saved_playlist_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_saved_playlist
    ADD CONSTRAINT user_saved_playlist_pkey PRIMARY KEY (user_uri, playlist_uri) INCLUDE (user_uri, playlist_uri);
 V   ALTER TABLE ONLY public.user_saved_playlist DROP CONSTRAINT user_saved_playlist_pkey;
       public            postgres    false    201    201    201    201            :           1259    16584    IDX_session_expire    INDEX     J   CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);
 (   DROP INDEX public."IDX_session_expire";
       public            postgres    false    203            =           2606    16438    user_saved_playlist user_uri    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_saved_playlist
    ADD CONSTRAINT user_uri FOREIGN KEY (user_uri) REFERENCES public."user"(uri) NOT VALID;
 F   ALTER TABLE ONLY public.user_saved_playlist DROP CONSTRAINT user_uri;
       public          postgres    false    200    201    2869           