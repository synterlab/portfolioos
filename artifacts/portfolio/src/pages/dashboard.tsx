import { useState } from "react";
import { useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetMyPortfolio, useCreateMyPortfolio, useUpdateMyPortfolio,
  useGetMyItems, useCreateItem, useUpdateItem, useDeleteItem,
  getGetMyPortfolioQueryKey, getGetMyItemsQueryKey, useCheckUsername,
  getCheckUsernameQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User, Briefcase, GraduationCap, FolderOpen, ExternalLink,
  Copy, Check, Plus, Trash2, Pencil, X, LogOut, Globe, ChevronRight,
} from "lucide-react";

function SinalyticaLogo({ size = 24 }: { size?: number }) {
  return (
    <img
      src="/sinalytica-logo.png"
      alt="Sinalytica"
      width={size}
      height={size}
      style={{ imageRendering: "pixelated", flexShrink: 0 }}
    />
  );
}

type Section = "profile" | "experience" | "education" | "projects";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} data-testid="button-copy-url" className="text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ─── Onboarding ────────────────────────────────────────────────────────────
function Onboarding({ onCreate }: { onCreate: () => void }) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [usernameDebounced, setUsernameDebounced] = useState("");
  const queryClient = useQueryClient();
  const createPortfolio = useCreateMyPortfolio();

  const { data: availability } = useCheckUsername(usernameDebounced, {
    query: {
      enabled: usernameDebounced.length >= 3,
      queryKey: getCheckUsernameQueryKey(usernameDebounced),
    },
  });

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(clean);
    clearTimeout((window as any).__usernameTimer);
    (window as any).__usernameTimer = setTimeout(() => setUsernameDebounced(clean), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability?.available || !username || !displayName) return;
    await createPortfolio.mutateAsync({ data: { username, displayName, isPublic: true } });
    queryClient.invalidateQueries({ queryKey: getGetMyPortfolioQueryKey() });
    onCreate();
  };

  const isAvailable = usernameDebounced.length >= 3 && availability?.available;
  const isTaken = usernameDebounced.length >= 3 && availability?.available === false;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <SinalyticaLogo size={32} />
          <span className="font-bold text-lg tracking-tight">sinalytica.life</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Claim your username</h1>
        <p className="text-muted-foreground mb-8">Your portfolio will be live at <span className="text-foreground font-mono">sinalytica.life/p/username</span></p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block" htmlFor="input-username">Username</label>
            <div className="relative">
              <Input
                id="input-username"
                data-testid="input-username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="johndoe"
                className="font-mono pr-24"
                minLength={3}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium">
                {usernameDebounced.length >= 3 && (
                  isAvailable
                    ? <span className="text-emerald-400">Available</span>
                    : isTaken ? <span className="text-red-400">Taken</span> : null
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" htmlFor="input-displayname">Display Name</label>
            <Input
              id="input-displayname"
              data-testid="input-displayname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <Button
            type="submit"
            data-testid="button-create-portfolio"
            className="w-full"
            disabled={!isAvailable || !displayName || createPortfolio.isPending}
          >
            {createPortfolio.isPending ? "Creating..." : "Create Portfolio"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Profile Form ───────────────────────────────────────────────────────────
function ProfileForm({ portfolio }: { portfolio: any }) {
  const queryClient = useQueryClient();
  const updatePortfolio = useUpdateMyPortfolio();
  const [form, setForm] = useState({
    displayName: portfolio.displayName ?? "",
    tagline: portfolio.tagline ?? "",
    bio: portfolio.bio ?? "",
    email: portfolio.email ?? "",
    location: portfolio.location ?? "",
    avatarUrl: portfolio.avatarUrl ?? "",
    isPublic: portfolio.isPublic ?? true,
    skills: (portfolio.skills ?? []).join(", "),
    github: portfolio.socialLinks?.github ?? "",
    linkedin: portfolio.socialLinks?.linkedin ?? "",
    twitter: portfolio.socialLinks?.twitter ?? "",
    website: portfolio.socialLinks?.website ?? "",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePortfolio.mutateAsync({
      data: {
        displayName: form.displayName,
        tagline: form.tagline,
        bio: form.bio,
        email: form.email,
        location: form.location,
        avatarUrl: form.avatarUrl,
        isPublic: form.isPublic,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        socialLinks: { github: form.github, linkedin: form.linkedin, twitter: form.twitter, website: form.website },
      },
    });
    queryClient.invalidateQueries({ queryKey: getGetMyPortfolioQueryKey() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const f = (key: string) => ({
    value: (form as any)[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Display Name</label>
          <Input data-testid="input-display-name" {...f("displayName")} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Location</label>
          <Input data-testid="input-location" {...f("location")} placeholder="San Francisco, CA" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Tagline</label>
        <Input data-testid="input-tagline" {...f("tagline")} placeholder="Software Engineer & Entrepreneur" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Bio</label>
        <Textarea data-testid="input-bio" {...f("bio")} rows={4} placeholder="Tell visitors about yourself..." />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Skills <span className="text-muted-foreground font-normal">(comma separated)</span></label>
        <Input data-testid="input-skills" {...f("skills")} placeholder="React, TypeScript, Python, Machine Learning" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Email</label>
        <Input data-testid="input-email" type="email" {...f("email")} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Avatar URL</label>
        <Input data-testid="input-avatar-url" {...f("avatarUrl")} placeholder="https://..." />
      </div>
      <div className="border border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">Social Links</p>
        <div className="grid grid-cols-2 gap-3">
          <Input data-testid="input-github" {...f("github")} placeholder="GitHub URL" />
          <Input data-testid="input-linkedin" {...f("linkedin")} placeholder="LinkedIn URL" />
          <Input data-testid="input-twitter" {...f("twitter")} placeholder="Twitter/X URL" />
          <Input data-testid="input-website" {...f("website")} placeholder="Personal Website" />
        </div>
      </div>
      <div className="flex items-center justify-between border border-border rounded-xl p-4">
        <div>
          <p className="font-medium text-sm">Public Portfolio</p>
          <p className="text-xs text-muted-foreground mt-0.5">Anyone with the link can view your portfolio</p>
        </div>
        <Switch
          data-testid="switch-is-public"
          checked={form.isPublic}
          onCheckedChange={(v) => setForm((p) => ({ ...p, isPublic: v }))}
        />
      </div>
      <Button type="submit" data-testid="button-save-profile" disabled={updatePortfolio.isPending}>
        {saved ? <><Check size={14} className="mr-1.5" />Saved</> : updatePortfolio.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

// ─── Item Form ──────────────────────────────────────────────────────────────
function ItemForm({ type, item, onClose }: { type: string; item?: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const [form, setForm] = useState({
    title: item?.title ?? "",
    subtitle: item?.subtitle ?? "",
    description: item?.description ?? "",
    startDate: item?.startDate ?? "",
    endDate: item?.endDate ?? "",
    isCurrent: item?.isCurrent ?? false,
    url: item?.url ?? "",
    tags: (item?.tags ?? []).join(", "),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      isCurrent: form.isCurrent,
      url: form.url || undefined,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (item) {
      await updateItem.mutateAsync({ id: item.id, data });
    } else {
      await createItem.mutateAsync({ data });
    }
    queryClient.invalidateQueries({ queryKey: getGetMyItemsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetMyPortfolioQueryKey() });
    onClose();
  };

  const f = (key: string) => ({
    value: (form as any)[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const typeLabel = type === "experience" ? "Role / Position" : type === "education" ? "Degree / Program" : "Project Name";
  const subtitleLabel = type === "experience" ? "Company" : type === "education" ? "Institution" : "Subtitle";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">{item ? "Edit" : "Add"} {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <button onClick={onClose} data-testid="button-close-modal" className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input data-testid="input-item-title" {...f("title")} placeholder={typeLabel} required />
          <Input data-testid="input-item-subtitle" {...f("subtitle")} placeholder={subtitleLabel} />
          <Textarea data-testid="input-item-description" {...f("description")} placeholder="Description..." rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Input data-testid="input-start-date" {...f("startDate")} placeholder="Start (e.g. 2022)" />
            <Input data-testid="input-end-date" {...f("endDate")} placeholder="End (or leave blank)" disabled={form.isCurrent} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              data-testid="checkbox-is-current"
              checked={form.isCurrent}
              onChange={(e) => setForm((p) => ({ ...p, isCurrent: e.target.checked }))}
              className="rounded"
            />
            Currently ongoing
          </label>
          {type === "project" && (
            <Input data-testid="input-item-url" {...f("url")} placeholder="Project URL" />
          )}
          <Input data-testid="input-item-tags" {...f("tags")} placeholder="Tags (comma separated)" />
          <div className="flex gap-3 pt-1">
            <Button type="submit" data-testid="button-save-item" className="flex-1" disabled={createItem.isPending || updateItem.isPending}>
              {createItem.isPending || updateItem.isPending ? "Saving..." : item ? "Save Changes" : "Add"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Items List ─────────────────────────────────────────────────────────────
function ItemsList({ type, label, icon: Icon }: { type: string; label: string; icon: any }) {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useGetMyItems();
  const deleteItem = useDeleteItem();
  const [editing, setEditing] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  const filtered = items.filter((i: any) => i.type === type);

  const handleDelete = async (id: number) => {
    await deleteItem.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getGetMyItemsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetMyPortfolioQueryKey() });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-muted-foreground" />
          <span className="font-semibold">{label}</span>
          <Badge variant="secondary" className="text-xs">{filtered.length}</Badge>
        </div>
        <Button size="sm" data-testid={`button-add-${type}`} onClick={() => setAdding(true)}>
          <Plus size={14} className="mr-1" />Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
          No {label.toLowerCase()} yet. Add your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item: any) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-xl p-4 bg-card group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" data-testid={`text-item-title-${item.id}`}>{item.title}</p>
                  {item.subtitle && <p className="text-muted-foreground text-xs mt-0.5">{item.subtitle}</p>}
                  {(item.startDate || item.endDate || item.isCurrent) && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {item.startDate}{item.startDate && (item.endDate || item.isCurrent) ? " — " : ""}
                      {item.isCurrent ? "Present" : item.endDate}
                    </p>
                  )}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 4).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    data-testid={`button-edit-item-${item.id}`}
                    onClick={() => setEditing(item)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    data-testid={`button-delete-item-${item.id}`}
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(adding || editing) && (
          <ItemForm
            type={type}
            item={editing}
            onClose={() => { setAdding(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard Shell ─────────────────────────────────────────────────────────
const NAV: { id: Section; label: string; icon: any }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderOpen },
];

export default function Dashboard() {
  const { data: portfolio, isLoading, error } = useGetMyPortfolio();
  const { signOut } = useClerk();
  const [section, setSection] = useState<Section>("profile");
  const [created, setCreated] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 w-full max-w-sm">
          <div className="h-4 bg-secondary rounded animate-pulse" />
          <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
          <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return <Onboarding onCreate={() => setCreated(true)} />;
  }

  const publicUrl = `${window.location.origin}/p/${portfolio.username}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-border flex items-center gap-2.5">
          <SinalyticaLogo size={26} />
          <span className="font-bold tracking-tight text-sm">sinalytica.life</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              data-testid={`nav-${id}`}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                section === id
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon size={15} />
              {label}
              {section === id && <ChevronRight size={13} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-2 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 text-xs">
            <Globe size={12} className="text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate font-mono">/p/{portfolio.username}</span>
            <CopyButton text={publicUrl} />
            <a href={publicUrl} target="_blank" rel="noreferrer" data-testid="link-view-portfolio" className="text-muted-foreground hover:text-foreground ml-auto">
              <ExternalLink size={12} />
            </a>
          </div>
          <button
            data-testid="button-sign-out"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {section === "profile" && (
                <>
                  <h1 className="text-2xl font-bold mb-6">Profile</h1>
                  <ProfileForm portfolio={portfolio} />
                </>
              )}
              {section === "experience" && (
                <>
                  <h1 className="text-2xl font-bold mb-6">Experience</h1>
                  <ItemsList type="experience" label="Experience" icon={Briefcase} />
                </>
              )}
              {section === "education" && (
                <>
                  <h1 className="text-2xl font-bold mb-6">Education</h1>
                  <ItemsList type="education" label="Education" icon={GraduationCap} />
                </>
              )}
              {section === "projects" && (
                <>
                  <h1 className="text-2xl font-bold mb-6">Projects</h1>
                  <ItemsList type="project" label="Projects" icon={FolderOpen} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
