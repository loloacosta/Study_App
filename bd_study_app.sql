PGDMP     (    5            
    {           bd_study_app    12.11    12.11 7    L           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            M           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            N           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            O           1262    41431    bd_study_app    DATABASE     �   CREATE DATABASE bd_study_app WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Spanish_Paraguay.1252' LC_CTYPE = 'Spanish_Paraguay.1252';
    DROP DATABASE bd_study_app;
                postgres    false            �            1259    41432    comments    TABLE     �   CREATE TABLE public.comments (
    id integer NOT NULL,
    text text NOT NULL,
    topic_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    41439    comments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public          postgres    false    202            P           0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public          postgres    false    203            �            1259    41441    shared_topics    TABLE     �   CREATE TABLE public.shared_topics (
    id integer NOT NULL,
    user_shared_id integer NOT NULL,
    topic_id integer NOT NULL,
    user_destination_id integer NOT NULL
);
 !   DROP TABLE public.shared_topics;
       public         heap    postgres    false            �            1259    41444    shared_topics_id_seq    SEQUENCE     �   CREATE SEQUENCE public.shared_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.shared_topics_id_seq;
       public          postgres    false    204            Q           0    0    shared_topics_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.shared_topics_id_seq OWNED BY public.shared_topics.id;
          public          postgres    false    205            �            1259    41446    themes    TABLE       CREATE TABLE public.themes (
    id integer NOT NULL,
    create_date timestamp without time zone,
    name character varying,
    description character varying,
    keywords character varying,
    owner_user_id integer,
    order_index integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.themes;
       public         heap    postgres    false            �            1259    41452    themes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.themes_id_seq;
       public          postgres    false    206            R           0    0    themes_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.themes_id_seq OWNED BY public.themes.id;
          public          postgres    false    207            �            1259    41454    themes_properties    TABLE     �   CREATE TABLE public.themes_properties (
    id integer NOT NULL,
    theme_id integer,
    property_name character varying,
    property_value character varying
);
 %   DROP TABLE public.themes_properties;
       public         heap    postgres    false            �            1259    41460    themes_properties_id_seq    SEQUENCE     �   CREATE SEQUENCE public.themes_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.themes_properties_id_seq;
       public          postgres    false    208            S           0    0    themes_properties_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.themes_properties_id_seq OWNED BY public.themes_properties.id;
          public          postgres    false    209            �            1259    41462    topics    TABLE     &  CREATE TABLE public.topics (
    id integer NOT NULL,
    create_date timestamp without time zone,
    name character varying,
    topic_id integer,
    "order" integer,
    priority integer,
    color character varying,
    owner_user_id integer,
    order_index integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.topics;
       public         heap    postgres    false            �            1259    41468    topics_id_seq    SEQUENCE     �   CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.topics_id_seq;
       public          postgres    false    210            T           0    0    topics_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;
          public          postgres    false    211            �            1259    41470    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    last_name character varying,
    avatar character varying,
    email character varying,
    password character varying,
    deleted boolean,
    token character varying
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    41476    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    212            U           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    213            �
           2604    41478    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202            �
           2604    41479    shared_topics id    DEFAULT     t   ALTER TABLE ONLY public.shared_topics ALTER COLUMN id SET DEFAULT nextval('public.shared_topics_id_seq'::regclass);
 ?   ALTER TABLE public.shared_topics ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204            �
           2604    41480 	   themes id    DEFAULT     f   ALTER TABLE ONLY public.themes ALTER COLUMN id SET DEFAULT nextval('public.themes_id_seq'::regclass);
 8   ALTER TABLE public.themes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206            �
           2604    41481    themes_properties id    DEFAULT     |   ALTER TABLE ONLY public.themes_properties ALTER COLUMN id SET DEFAULT nextval('public.themes_properties_id_seq'::regclass);
 C   ALTER TABLE public.themes_properties ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    208            �
           2604    41482 	   topics id    DEFAULT     f   ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);
 8   ALTER TABLE public.topics ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210            �
           2604    41483    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212            >          0    41432    comments 
   TABLE DATA           K   COPY public.comments (id, text, topic_id, user_id, created_at) FROM stdin;
    public          postgres    false    202   A       @          0    41441    shared_topics 
   TABLE DATA           Z   COPY public.shared_topics (id, user_shared_id, topic_id, user_destination_id) FROM stdin;
    public          postgres    false    204   9B       B          0    41446    themes 
   TABLE DATA           j   COPY public.themes (id, create_date, name, description, keywords, owner_user_id, order_index) FROM stdin;
    public          postgres    false    206   rB       D          0    41454    themes_properties 
   TABLE DATA           X   COPY public.themes_properties (id, theme_id, property_name, property_value) FROM stdin;
    public          postgres    false    208   ^C       F          0    41462    topics 
   TABLE DATA           w   COPY public.topics (id, create_date, name, topic_id, "order", priority, color, owner_user_id, order_index) FROM stdin;
    public          postgres    false    210   �C       H          0    41470    users 
   TABLE DATA           ]   COPY public.users (id, name, last_name, avatar, email, password, deleted, token) FROM stdin;
    public          postgres    false    212   �D       V           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 11, true);
          public          postgres    false    203            W           0    0    shared_topics_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.shared_topics_id_seq', 19, true);
          public          postgres    false    205            X           0    0    themes_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.themes_id_seq', 7, true);
          public          postgres    false    207            Y           0    0    themes_properties_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.themes_properties_id_seq', 14, true);
          public          postgres    false    209            Z           0    0    topics_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.topics_id_seq', 19, true);
          public          postgres    false    211            [           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 14, true);
          public          postgres    false    213            �
           2606    41485    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    202            �
           2606    41487     shared_topics shared_topics_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.shared_topics
    ADD CONSTRAINT shared_topics_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.shared_topics DROP CONSTRAINT shared_topics_pkey;
       public            postgres    false    204            �
           2606    41489    themes themes_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.themes DROP CONSTRAINT themes_pkey;
       public            postgres    false    206            �
           2606    41491 (   themes_properties themes_properties_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.themes_properties
    ADD CONSTRAINT themes_properties_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.themes_properties DROP CONSTRAINT themes_properties_pkey;
       public            postgres    false    208            �
           2606    41493    topics topics_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.topics DROP CONSTRAINT topics_pkey;
       public            postgres    false    210            �
           2606    41495    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    212            �
           2606    41496    comments comments_topic_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);
 I   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_topic_id_fkey;
       public          postgres    false    202    210    2740            �
           2606    41501    comments comments_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 H   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_user_id_fkey;
       public          postgres    false    212    2742    202            �
           2606    41506 )   shared_topics shared_topics_topic_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shared_topics
    ADD CONSTRAINT shared_topics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);
 S   ALTER TABLE ONLY public.shared_topics DROP CONSTRAINT shared_topics_topic_id_fkey;
       public          postgres    false    204    210    2740            �
           2606    41511 4   shared_topics shared_topics_user_destination_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shared_topics
    ADD CONSTRAINT shared_topics_user_destination_id_fkey FOREIGN KEY (user_destination_id) REFERENCES public.users(id);
 ^   ALTER TABLE ONLY public.shared_topics DROP CONSTRAINT shared_topics_user_destination_id_fkey;
       public          postgres    false    2742    204    212            �
           2606    41516 /   shared_topics shared_topics_user_shared_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shared_topics
    ADD CONSTRAINT shared_topics_user_shared_id_fkey FOREIGN KEY (user_shared_id) REFERENCES public.users(id);
 Y   ALTER TABLE ONLY public.shared_topics DROP CONSTRAINT shared_topics_user_shared_id_fkey;
       public          postgres    false    204    212    2742            �
           2606    41521     themes themes_owner_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.themes DROP CONSTRAINT themes_owner_user_id_fkey;
       public          postgres    false    206    2742    212            �
           2606    41526 1   themes_properties themes_properties_theme_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.themes_properties
    ADD CONSTRAINT themes_properties_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.themes(id);
 [   ALTER TABLE ONLY public.themes_properties DROP CONSTRAINT themes_properties_theme_id_fkey;
       public          postgres    false    208    2736    206            �
           2606    41531     topics topics_owner_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.topics DROP CONSTRAINT topics_owner_user_id_fkey;
       public          postgres    false    212    210    2742            �
           2606    41536    topics topics_topic_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);
 E   ALTER TABLE ONLY public.topics DROP CONSTRAINT topics_topic_id_fkey;
       public          postgres    false    210    210    2740            >   $  x��R�n!<�W��<�{���^��l��M���\�4�*�e��x4��n�0����n�|�!5l�s9C�$� �qv@�<�@��r\�'!=j��Nf��m	#�$��\�-1
Pz���?$쓄��<H��(>�kM�
�U���y�^5�Js�>ϴk��<�e�fw��L9_�}8�u	��*����1�%軆5^s�!�mɑ�9�D%�@���H�ߤ\�#E*���wwr|i�z�Q�Ol���s}��P��Q(����@�� ��x�Q0qD�M���p�Y떵�_�s�.g��      @   )   x�34�4�44�4�24����-�b�\�� �9P0F��� �6      B   �   x�}��j!�>�<�&�nBo9�%-=��˰NŠ΢n�o_B��% ����?�B+ݭ�v��@�_��G�(�	/�Y�D�P�W�F8Ř�&��>�
%�sj&�� ?�Ά֗�$6�|U�������{�+�(NlkC�q���{�����Ř�q0�2F�)w-�y��+���b�7,��e�B�|q��I��u��Dq
�8W#?�R�_�"y�      D   �   x�M��� D��S0A�дt����T�@2A������c0���0��:%�f��85˚�+��`��/v<l�B#4�˥�۩�����c����~�'hb�9�*nP� /���JFO܊��V�M�w5��x�-���}
�37      F      x�}��
�@D�ݯ\��#^bmm!�i$��U'���`�)v��L���z�N��	͗_�&�	�Ƹ���,���z�4�r�:i׹��z�e+������?.�1�;ו��>4�h�,����o�,�      H   #  x�m��n�@�����`��w���ZYQĘ4ˢeaa�ˏ��e�j��Lf����8�qZ�Z�J.����޾sʅ�d����9��R�k	������/��@�YvE���f2ZS�T���aYqc&UIu���?���H��+���ۄc���&x���a?Y�����8�ܟ���A�=aȻD��<n5<M#D�p�����q<����&?vB�F�8�f�a �2'u��Iܕ�~�_���m?�,�Yz�p�m>�B���Ά�hu|�[7��Y������1N�a?؁}     