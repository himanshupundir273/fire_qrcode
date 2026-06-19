'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Upload, X, ImageIcon, Video, AlertTriangle, Loader2,
  Building2, User, Phone, MapPin, Wrench, FileText,
  Calendar, Clock, LocateFixed, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { supportRequestSchema, SupportRequestFormData } from '@/lib/validations'
import { submitSupportRequest } from '@/actions/requests'
import { createClient } from '@/lib/supabase/client'
import { PanelItemRow } from '@/components/forms/PanelItemRow'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh',
]

interface UploadedFile { file: File; preview: string }

function SectionHeader({ icon: Icon, title, subtitle }: {
  icon: React.ElementType; title: string; subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-red-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1">{message}</p>
}

export function SupportRequestForm() {
  const router = useRouter()
  const [issuePhotos, setIssuePhotos] = useState<UploadedFile[]>([])
  const [video, setVideo] = useState<UploadedFile | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [locating, setLocating] = useState(false)

  const {
    register, handleSubmit, setValue, watch, control,
    formState: { errors },
  } = useForm<SupportRequestFormData>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      panels: [{ item_name: '', model: '', serial_number: '', issue_title: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'panels' })
  const selectedState = watch('state')

  const addFiles = (files: FileList, setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => {
    const newFiles = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setter((prev) => [...prev, ...newFiles].slice(0, 10))
  }

  const setVideoFile = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith('video/')) {
      setVideo({ file, preview: URL.createObjectURL(file) })
    }
  }

  const matchState = (raw: string): string | undefined => {
    if (!raw) return undefined
    const normalized = raw.toLowerCase().trim()
    const direct = INDIAN_STATES.find((s) => s.toLowerCase() === normalized)
    if (direct) return direct
    const aliases: Record<string, string> = {
      'up': 'Uttar Pradesh', 'mp': 'Madhya Pradesh', 'hp': 'Himachal Pradesh',
      'j&k': 'Jammu and Kashmir', 'jammu & kashmir': 'Jammu and Kashmir',
      'uttaranchal': 'Uttarakhand', 'orissa': 'Odisha',
      'national capital territory of delhi': 'Delhi', 'nct of delhi': 'Delhi',
      'state of uttarakhand': 'Uttarakhand', 'state of uttar pradesh': 'Uttar Pradesh',
      'state of maharashtra': 'Maharashtra', 'state of gujarat': 'Gujarat',
      'state of rajasthan': 'Rajasthan', 'state of karnataka': 'Karnataka',
      'state of kerala': 'Kerala', 'state of tamil nadu': 'Tamil Nadu',
      'state of west bengal': 'West Bengal', 'state of bihar': 'Bihar',
      'state of odisha': 'Odisha', 'state of assam': 'Assam',
      'state of punjab': 'Punjab', 'state of haryana': 'Haryana',
      'state of jharkhand': 'Jharkhand', 'state of chhattisgarh': 'Chhattisgarh',
      'state of goa': 'Goa', 'state of himachal pradesh': 'Himachal Pradesh',
      'state of manipur': 'Manipur', 'state of meghalaya': 'Meghalaya',
      'state of mizoram': 'Mizoram', 'state of nagaland': 'Nagaland',
      'state of sikkim': 'Sikkim', 'state of tripura': 'Tripura',
      'state of arunachal pradesh': 'Arunachal Pradesh',
      'state of andhra pradesh': 'Andhra Pradesh', 'state of telangana': 'Telangana',
    }
    if (aliases[normalized]) return aliases[normalized]
    return INDIAN_STATES.find((s) =>
      normalized.includes(s.toLowerCase()) || s.toLowerCase().includes(normalized)
    )
  }

  const fetchLocation = async () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords
          const [res16, res18] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=16`, { headers: { 'Accept-Language': 'en-IN,en' } }),
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`, { headers: { 'Accept-Language': 'en-IN,en' } }),
          ])
          const [data16, data18] = await Promise.all([res16.json(), res18.json()])
          const a16 = data16.address || {}
          const a18 = data18.address || {}
          const sector = a16.suburb || a16.neighbourhood || a16.residential || a16.quarter || ''
          const road = a18.road || a18.pedestrian || a18.footway || ''
          const block = a18.house_number || a18.building || ''
          const addrParts = [block, road, sector].filter((v, i, arr) => v && arr.indexOf(v) === i)
          const fullAddress = addrParts.join(', ')
          if (fullAddress) setValue('address', fullAddress, { shouldValidate: true })
          const city = a18.city || a18.town || a16.city || a16.town || a18.village || a16.village || a18.municipality || a16.municipality || ''
          if (city) setValue('city', city, { shouldValidate: true })
          const pin = (a18.postcode || a16.postcode || '').replace(/\s/g, '').slice(0, 6)
          if (pin.length === 6) setValue('pincode', pin, { shouldValidate: true })
          const stateRaw = a18.state || a16.state || ''
          const matched = matchState(stateRaw)
          if (matched) setValue('state', matched, { shouldValidate: true })
          else toast.warning(`State "${stateRaw}" couldn't be matched — please select manually.`)
          toast.success(`Location detected!${accuracy > 100 ? ` (±${Math.round(accuracy)}m)` : ''} Please verify.`)
        } catch { toast.error('Could not fetch address. Please enter manually.') }
        finally { setLocating(false) }
      },
      (err) => {
        if (err.code === 1) toast.error('Location permission denied.')
        else if (err.code === 2) toast.error('Location unavailable. Try again or enter manually.')
        else toast.error('Location request timed out.')
        setLocating(false)
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    )
  }

  const uploadToSupabase = async (file: File, bucket: string, path: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    return urlData.publicUrl
  }

  const onSubmit = async (data: SupportRequestFormData) => {
    setSubmitting(true)
    try {
      const uploadedIssuePhotos: { url: string; name: string }[] = []
      let uploadedVideo: { url: string; name: string } | null = null

      for (const item of issuePhotos) {
        const path = `issue-photos/${Date.now()}-${item.file.name}`
        const url = await uploadToSupabase(item.file, 'support-media', path)
        uploadedIssuePhotos.push({ url, name: item.file.name })
      }
      if (video) {
        const path = `videos/${Date.now()}-${video.file.name}`
        const url = await uploadToSupabase(video.file, 'support-media', path)
        uploadedVideo = { url, name: video.file.name }
      }

      // Derive top-level fields from first panel; store all panels as JSON
      const firstPanel = data.panels[0]
      const submissionData: SupportRequestFormData = {
        ...data,
        panel_brand: firstPanel.item_name,
        panel_model: firstPanel.model,
        issue_title: firstPanel.issue_title,
        issue_description: JSON.stringify(data.panels),
        priority: 'medium',
      }

      const { ticketId } = await submitSupportRequest(submissionData, {
        productPhotos: [],
        issuePhotos: uploadedIssuePhotos,
        video: uploadedVideo,
      })

      toast.success('Request submitted successfully!')
      router.push(`/success/${ticketId}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* 1. Panel & Issue Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <SectionHeader
          icon={Wrench}
          title="Panel & Issue Details"
          subtitle="Provide details about your fire alarm panel and the issue"
        />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <PanelItemRow
              key={field.id}
              index={index}
              control={control}
              setValue={setValue}
              errors={errors}
              showRemove={fields.length > 1}
              onRemove={() => remove(index)}
            />
          ))}

          {/* Add Panel button */}
          <button
            type="button"
            onClick={() => append({ item_name: '', model: '', serial_number: '', issue_title: '' })}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Panel
          </button>

          {errors.panels?.root?.message && (
            <FieldError message={errors.panels.root.message} />
          )}
        </div>
      </div>

      {/* 2. Upload Media */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <SectionHeader
          icon={ImageIcon}
          title="Upload Media"
          subtitle="Photos and videos help our technicians prepare before the visit"
        />
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Issue / Damage Photos (up to 10)
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">Click to upload issue/damage photos</span>
              <span className="text-xs text-gray-400">PNG, JPG, WebP (max 10MB each)</span>
              <input type="file" className="hidden" accept="image/*" multiple
                onChange={(e) => e.target.files && addFiles(e.target.files, setIssuePhotos)} />
            </label>
            {issuePhotos.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {issuePhotos.map((f, i) => (
                  <div key={i} className="relative group w-20 h-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.preview} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => setIssuePhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Issue Video <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            {!video ? (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
                <Video className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Click to upload a video</span>
                <span className="text-xs text-gray-400">MP4, MOV, AVI (max 50MB)</span>
                <input type="file" className="hidden" accept="video/*"
                  onChange={(e) => e.target.files && setVideoFile(e.target.files)} />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Video className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{video.file.name}</p>
                  <p className="text-xs text-gray-400">{(video.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={() => setVideo(null)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Contact Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <SectionHeader icon={Building2} title="Contact Information" subtitle="How should we reach you?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="contact_person" className="text-sm font-medium text-gray-700">
              Contact Person <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="contact_person" placeholder="Full name of contact person" className="pl-9" {...register('contact_person')} />
            </div>
            <FieldError message={errors.contact_person?.message} />
          </div>
          <div>
            <Label htmlFor="contact_number" className="text-sm font-medium text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="contact_number" placeholder="10-digit mobile number" className="pl-9" maxLength={10} {...register('contact_number')} />
            </div>
            <FieldError message={errors.contact_number?.message} />
          </div>
        </div>
      </div>

      {/* 4. Site Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Site Address</h3>
              <p className="text-sm text-gray-500 mt-0.5">Where is the fire alarm panel installed?</p>
            </div>
          </div>
          <button type="button" onClick={fetchLocation} disabled={locating}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0 ml-4">
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            {locating ? 'Detecting...' : 'Use Current Location'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Complete Address <span className="text-red-500">*</span>
            </Label>
            <Textarea id="address" placeholder="Building/Flat no., Street, Area, Landmark" className="mt-1 resize-none" rows={2} {...register('address')} />
            <FieldError message={errors.address?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></Label>
              <Input id="city" placeholder="City" className="mt-1" {...register('city')} />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></Label>
              <Select value={selectedState || ''} onValueChange={(v) => setValue('state', v, { shouldValidate: true })}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="text-gray-900 hover:bg-red-50 hover:text-red-700 cursor-pointer py-2 px-3">{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.state?.message} />
            </div>
            <div>
              <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode <span className="text-red-500">*</span></Label>
              <Input id="pincode" placeholder="6-digit pincode" maxLength={6} className="mt-1" {...register('pincode')} />
              <FieldError message={errors.pincode?.message} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Visit Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <SectionHeader icon={Calendar} title="Preferred Visit Schedule" subtitle="Let us know when you would prefer a technician visit (optional)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="visit_date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> Preferred Visit Date
            </Label>
            <Input id="visit_date" type="date" min={new Date().toISOString().split('T')[0]} className="mt-1" {...register('visit_date')} />
          </div>
          <div>
            <Label htmlFor="visit_time" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Preferred Visit Time
            </Label>
            <Select onValueChange={(v) => setValue('visit_time', v)}>
              <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'].map((slot) => (
                  <SelectItem key={slot} value={slot} className="text-gray-900 hover:bg-red-50 hover:text-red-700 cursor-pointer py-2 px-3">{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          By submitting this form, you consent to our team contacting you regarding the support request.
          A unique ticket ID will be generated for tracking purposes.
        </p>
      </div>

      <Button type="submit" disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg" size="lg">
        {submitting ? (
          <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Submitting Request...</>
        ) : (
          <><FileText className="mr-2 w-5 h-5" />Submit Support Request</>
        )}
      </Button>
    </form>
  )
}
