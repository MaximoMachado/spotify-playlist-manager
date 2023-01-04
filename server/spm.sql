--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

-- Started on 2020-12-31 19:03:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16576)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16432)
-- Name: track_in_playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.track_in_playlist (
    playlist_uri text NOT NULL,
    track_uri text NOT NULL
);


ALTER TABLE public.track_in_playlist OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16395)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public."user" (
    uri text NOT NULL,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ready boolean DEFAULT false NOT NULL,
    settings json DEFAULT '{ "playlistsToExclude": [], "allowDuplicates": true }'::json NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16412)
-- Name: user_saved_playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.user_saved_playlist (
    user_uri text NOT NULL,
    playlist_uri text NOT NULL
);


ALTER TABLE public.user_saved_playlist OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.track (
    uri text PRIMARY KEY,
    track_name text NOT NULL,
    duration_ms BIGINT NOT NULL,
    num_artists BIGINT NOT NULL,
    first_artist_name text NOT NULL
);


ALTER TABLE public.track OWNER TO postgres;

--
-- TOC entry 2877 (class 2606 OID 16583)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2874 (class 2606 OID 16494)
-- Name: track_in_playlist track_in_playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_in_playlist
    ADD CONSTRAINT track_in_playlist_pkey PRIMARY KEY (playlist_uri, track_uri) INCLUDE (playlist_uri, track_uri);


--
-- TOC entry 2868 (class 2606 OID 16444)
-- Name: user uri; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uri UNIQUE (uri);


--
-- TOC entry 2870 (class 2606 OID 16421)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (uri);


--
-- TOC entry 2872 (class 2606 OID 16478)
-- Name: user_saved_playlist user_saved_playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_saved_playlist
    ADD CONSTRAINT user_saved_playlist_pkey PRIMARY KEY (user_uri, playlist_uri) INCLUDE (user_uri, playlist_uri);


--
-- TOC entry 2875 (class 1259 OID 16584)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 2878 (class 2606 OID 16438)
-- Name: user_saved_playlist user_uri; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_saved_playlist
    ADD CONSTRAINT user_uri FOREIGN KEY (user_uri) REFERENCES public."user"(uri) NOT VALID;


--
-- Add foreign key constraint that links track_in_playlist to track table
--
ALTER TABLE ONLY public.track_in_playlist
    ADD CONSTRAINT track_uri FOREIGN KEY (track_uri) REFERENCES public."track"(uri) NOT VALID;

-- Completed on 2020-12-31 19:03:17

--
-- PostgreSQL database dump complete
--

